import {
  Injectable,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { ConfigService } from '@nestjs/config';

interface RegisterDto {
  legalName: string;
  taxIdentifier: string;
  taxIdentifierType: string;
  businessType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.orgRepo.findOne({
      where: { taxIdentifier: dto.taxIdentifier },
    });

    if (existing) {
      throw new ConflictException('Organization with this tax ID already exists');
    }

    let clerkUser;
    try {
      clerkUser = await this.createClerkUser(dto);
      this.logger.log(`Clerk user created: ${clerkUser.id}`);
    } catch (err: any) {
      this.logger.error('Clerk error:', err.message);
      throw new BadRequestException(err.message);
    }

    const organization = this.orgRepo.create({
      legalName: dto.legalName,
      taxIdentifier: dto.taxIdentifier,
      taxIdentifierType: dto.taxIdentifierType,
      businessType: dto.businessType,
      tier: 'PENDING',
      verificationStatus: 'PENDING',
      isActive: false,
    });

    await this.orgRepo.save(organization);
    this.logger.log(`Organization created: ${organization.id}`);

    await this.updateClerkMetadata(clerkUser.id, organization.id);

    return {
      message: 'Registration submitted. Awaiting verification.',
      organizationId: organization.id,
      status: 'PENDING',
    };
  }

  private async createClerkUser(dto: RegisterDto) {
    const clerkKey = this.configService.get<string>('CLERK_SECRET_KEY');
    const username = dto.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');

    const userData = {
      first_name: dto.firstName,
      last_name: dto.lastName,
      password: dto.password,
      email_address: [dto.email],
      username: username,
      public_metadata: {
        tier: 'PENDING',
        role: 'ORG_ADMIN',
      },
    };

    this.logger.log('Creating Clerk user: ' + username);

    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      this.logger.error('Clerk error:', JSON.stringify(data));
      const msg = data?.errors?.[0]?.long_message || data?.errors?.[0]?.message || 'Failed';
      throw new Error(msg);
    }

    return data;
  }

  private async updateClerkMetadata(userId: string, orgId: string) {
    const clerkKey = this.configService.get<string>('CLERK_SECRET_KEY');

    await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${clerkKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_metadata: {
          organizationId: orgId,
          tier: 'PENDING',
          role: 'ORG_ADMIN',
        },
      }),
    });
  }
}