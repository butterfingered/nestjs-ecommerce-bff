import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'

@ApiTags('reports')
@Controller('reports')
export class ReportsController {}
