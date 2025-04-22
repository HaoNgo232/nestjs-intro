import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { postStatus } from './enums/postStatus.enum';
import { PostType } from './enums/postType.enums';
import { Matches } from 'class-validator';
import { MetaOptions } from '../meta-options/meta-options.entity';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and withoout spaces. For example "my-post"',
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  feeaturedImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  pulishOn?: Date;

  @OneToOne(() => MetaOptions, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true, // Load the related MetaOptions entity apply to all queries
  })
  metaOptions?: MetaOptions;

  @ManyToOne(() => User, (user) => user.post, {
    eager: true,
  })
  author: User;

  @ManyToMany(() => Tag, {
    eager: true,
  })
  @JoinTable()
  tags?: Tag[];
}
