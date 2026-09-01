#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/33cacc2243266869aeaad755d72ed9a7e7372e1f0f2109372429eb8507928566/contract';
import endContract from '../../snapshots/33cacc2243266869aeaad755d72ed9a7e7372e1f0f2109372429eb8507928566/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d952990ddb3317b06b0aba6de6a612a85c6c153c0f1643cce773423c9d5aa6c4/contract';
import startContract from '../../snapshots/d952990ddb3317b06b0aba6de6a612a85c6c153c0f1643cce773423c9d5aa6c4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'block',
        columns: [
          col('blockedId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('blockerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'block',
        constraint: 'block_blockerId_blockedId_key',
        columns: ['blockerId', 'blockedId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'block',
        index: 'block_blockedId_idx_e3047657',
        columns: ['blockedId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'block',
        index: 'block_blockerId_blockedId_idx_30ed83d6',
        columns: ['blockerId', 'blockedId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'block',
        index: 'block_blockerId_idx_a25bd35c',
        columns: ['blockerId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'block',
        foreignKey: {
          name: 'block_blockerId_fkey',
          columns: ['blockerId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'block',
        foreignKey: {
          name: 'block_blockedId_fkey',
          columns: ['blockedId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
