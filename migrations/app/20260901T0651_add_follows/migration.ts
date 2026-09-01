#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/a41c4b73d009a8e6b23bb2e6e8bf273210f3c626693ca260269cc8dff2bf7edb/contract';
import startContract from '../../snapshots/a41c4b73d009a8e6b23bb2e6e8bf273210f3c626693ca260269cc8dff2bf7edb/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d952990ddb3317b06b0aba6de6a612a85c6c153c0f1643cce773423c9d5aa6c4/contract';
import endContract from '../../snapshots/d952990ddb3317b06b0aba6de6a612a85c6c153c0f1643cce773423c9d5aa6c4/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'follow',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('followerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('followingId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
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
        table: 'follow',
        constraint: 'follow_followerId_followingId_key',
        columns: ['followerId', 'followingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'follow',
        index: 'follow_followerId_followingId_idx_26f4ee2c',
        columns: ['followerId', 'followingId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'follow',
        index: 'follow_followerId_idx_2aa6c62d',
        columns: ['followerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'follow',
        index: 'follow_followingId_idx_1cf16645',
        columns: ['followingId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'follow',
        foreignKey: {
          name: 'follow_followerId_fkey',
          columns: ['followerId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'follow',
        foreignKey: {
          name: 'follow_followingId_fkey',
          columns: ['followingId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
