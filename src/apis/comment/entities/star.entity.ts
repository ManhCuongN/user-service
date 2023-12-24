import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type StarDocument = Star & Document;

@Schema({ timestamps: true })
export class Star {
   @Prop()
   discuss_id!: string;

  @Prop()
	userAndStar!: {
		user: any;
		star: number;
	}[];
	@Prop({default: 0})
    num_star?: number;
}

export const StarSchema = SchemaFactory.createForClass(Star);
