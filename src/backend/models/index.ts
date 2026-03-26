import { Table, Column, Model, DataType, HasOne, HasMany, BelongsTo, ForeignKey, BelongsToMany } from "sequelize-typescript";

@Table({ tableName: "users" })
export class User extends Model {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({ type: DataType.ENUM("STUDENT", "ADMIN"), defaultValue: "STUDENT" })
  role!: string;

  @HasOne(() => Profile)
  profile!: Profile;

  @HasMany(() => SessionMember)
  sessionMemberships!: SessionMember[];

  @HasMany(() => Task, "assignedToId")
  assignedTasks!: Task[];

  @HasMany(() => CollaborationRequest, "senderId")
  sentRequests!: CollaborationRequest[];

  @HasMany(() => CollaborationRequest, "receiverId")
  receivedRequests!: CollaborationRequest[];

  @HasMany(() => Notification)
  notifications!: Notification[];
}

@Table({ tableName: "profiles" })
export class Profile extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.TEXT })
  bio!: string;

  @Column({ type: DataType.STRING })
  techStack!: string;

  @Column({ type: DataType.ENUM("BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"), defaultValue: "BEGINNER" })
  experienceLevel!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  xp!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  level!: number;
}

@Table({ tableName: "skills" })
export class Skill extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @ForeignKey(() => Profile)
  @Column({ type: DataType.INTEGER })
  profileId!: number;

  @BelongsTo(() => Profile)
  profile!: Profile;
}

@Table({ tableName: "study_sessions" })
export class StudySession extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ type: DataType.DATE })
  deadline!: Date;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  progress!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  creatorId!: number;

  @BelongsTo(() => User)
  creator!: User;

  @HasMany(() => SessionMember)
  members!: SessionMember[];

  @HasMany(() => Task)
  tasks!: Task[];
}

@Table({ tableName: "session_members" })
export class SessionMember extends Model {
  @ForeignKey(() => StudySession)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sessionId!: number;

  @BelongsTo(() => StudySession)
  session!: StudySession;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.ENUM("OWNER", "MEMBER"), defaultValue: "MEMBER" })
  role!: string;
}

@Table({ tableName: "tasks" })
export class Task extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ type: DataType.ENUM("PENDING", "IN_PROGRESS", "COMPLETED", "REVIEW"), defaultValue: "PENDING" })
  status!: string;

  @Column({ type: DataType.ENUM("LOW", "MEDIUM", "HIGH"), defaultValue: "MEDIUM" })
  priority!: string;

  @Column({ type: DataType.DATE })
  deadline!: Date;

  @ForeignKey(() => StudySession)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sessionId!: number;

  @BelongsTo(() => StudySession)
  session!: StudySession;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  assignedToId!: number;

  @BelongsTo(() => User, "assignedToId")
  assignedTo!: User;
}

@Table({ tableName: "collaboration_requests" })
export class CollaborationRequest extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  senderId!: number;

  @BelongsTo(() => User, "senderId")
  sender!: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  receiverId!: number;

  @BelongsTo(() => User, "receiverId")
  receiver!: User;

  @ForeignKey(() => StudySession)
  @Column({ type: DataType.INTEGER })
  sessionId!: number;

  @BelongsTo(() => StudySession)
  session!: StudySession;

  @Column({ type: DataType.ENUM("PENDING", "ACCEPTED", "REJECTED"), defaultValue: "PENDING" })
  status!: string;
}

@Table({ tableName: "notifications" })
export class Notification extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.STRING, allowNull: false })
  title!: string;

  @Column({ type: DataType.TEXT })
  message!: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isRead!: boolean;
}
