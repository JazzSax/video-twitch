#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/12cb5d5883ca0313cec3208423b93f4d5c9a3f8b82f83cbd986bc4b23a3b5ce2/contract';
import endContract from '../../snapshots/12cb5d5883ca0313cec3208423b93f4d5c9a3f8b82f83cbd986bc4b23a3b5ce2/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/33cacc2243266869aeaad755d72ed9a7e7372e1f0f2109372429eb8507928566/contract';
import startContract from '../../snapshots/33cacc2243266869aeaad755d72ed9a7e7372e1f0f2109372429eb8507928566/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'stream',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('ingressId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('isChatDelayed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('isChatEnabled', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('isChatFollowersOnly', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('isLive', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('serverUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('streamKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('thumbnail', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'stream',
        constraint: 'stream_ingressId_key',
        columns: ['ingressId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'stream',
        constraint: 'stream_userId_key',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'stream',
        foreignKey: {
          name: 'stream_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
