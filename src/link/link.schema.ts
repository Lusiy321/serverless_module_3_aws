/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

export type LinkDocument = Link & Document;
@Schema()
export class Link extends Model<Link> {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true })
  shortUrl: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  expiresAt: Date;

  @Prop({ default: 0 })
  visitCount: number;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
