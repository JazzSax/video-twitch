#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/12cb5d5883ca0313cec3208423b93f4d5c9a3f8b82f83cbd986bc4b23a3b5ce2/contract';
import startContract from '../../snapshots/12cb5d5883ca0313cec3208423b93f4d5c9a3f8b82f83cbd986bc4b23a3b5ce2/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/3147c5a05e82b9fc42d8d7fa9659bd2a19ff3c69dd044ceeba85805ea2e5050c/contract';
import endContract from '../../snapshots/3147c5a05e82b9fc42d8d7fa9659bd2a19ff3c69dd044ceeba85805ea2e5050c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'stream',
        column: col('video', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
