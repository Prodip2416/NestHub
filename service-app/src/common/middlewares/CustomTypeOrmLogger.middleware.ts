import { Logger, QueryRunner } from 'typeorm';

export class CustomTypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.log(`[QUERY]: ${query}`);
    if (parameters) {
      console.log(`[PARAMETERS]: ${JSON.stringify(parameters)}`);
    }
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.error(`[QUERY ERROR]: ${error}`);
    console.error(`[FAILED QUERY]: ${query}`);
    if (parameters) {
      console.error(`[PARAMETERS]: ${JSON.stringify(parameters)}`);
    }
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.warn(`[SLOW QUERY]: ${query} [Execution time: ${time} ms]`);
    if (parameters) {
      console.warn(`[PARAMETERS]: ${JSON.stringify(parameters)}`);
    }
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    console.log(`[SCHEMA BUILD]: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    console.log(`[MIGRATION]: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    console.log(`[${level.toUpperCase()}]: ${message}`);
  }
}
