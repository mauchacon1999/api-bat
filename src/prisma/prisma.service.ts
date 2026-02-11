import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client'; // Tu ruta personalizada
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Configuramos el Pool de conexiones de toda la vida
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // 2. Creamos el adaptador para Prisma 7
    const adapter = new PrismaPg(pool);

    // 3. Se lo pasamos al super constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
