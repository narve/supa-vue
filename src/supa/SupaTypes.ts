// Generated using https://jvilk.com/MakeTypes/

// export interface OpenApiData {
// 	swagger: string;
// 	info: Info;
// 	host: string;
// 	basePath: string;
// 	schemes?: (string)[] | null;
// 	consumes?: (string)[] | null;
// 	produces?: (string)[] | null;
// 	definitions: Definitions;
// 	externalDocs: ExternalDocs;
//
// 	// these two didn't map well to TS
// 	paths: any;
// 	parameters: any;
// }
// export interface Info {
// 	description: string;
// 	title: string;
// 	version: string;
// }
// export interface Definitions {
// 	assignment: Assignment;
// 	ceremony_statistics: CeremonyStatistics;
// 	countries: Countries;
// 	course: Course;
// 	employment: Employment;
// 	enrollment: Enrollment;
// 	item: Item;
// 	location: Location;
// 	lyrics: Lyrics;
// 	orderline: Orderline;
// 	participant: Participant;
// 	participant_statistics: ParticipantStatistics;
// 	profiles: Profiles;
// 	school: School;
// 	teacher: Teacher;
// 	user: User;
// }
// export interface Assignment {
// 	required?: (string)[] | null;
// 	properties: Properties;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties {
// 	id: Id;
// 	enrollment_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	status: StatusOrPhoneNumberOrEmailOrRole;
// 	title: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	description: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	attachment: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Id {
// 	type: string;
// 	format: string;
// 	default: string;
// 	description: string;
// 	name: string;
// 	isPk: boolean;
// 	isFk: boolean;
// }
// export interface EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId {
// 	type: string;
// 	format: string;
// 	description: string;
// 	name: string;
// 	isPk: boolean;
// 	isFk: boolean;
// 	fk: Fk;
// }
// export interface Fk {
// 	table: string;
// 	column: string;
// 	select: string;
// }
// export interface StatusOrPhoneNumberOrEmailOrRole {
// 	type: string;
// 	maxLength: number;
// 	format: string;
// 	name: string;
// 	isPk: boolean;
// 	isFk: boolean;
// }
// export interface TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite {
// 	type: string;
// 	format: string;
// 	name: string;
// 	isPk: boolean;
// 	isFk: boolean;
// }
// export interface CeremonyStatistics {
// 	properties: Properties1;
// 	type: string;
// }
// export interface Properties1 {
// 	rvsp_ceremony: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	count: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Countries {
// 	description: string;
// 	required?: (string)[] | null;
// 	properties: Properties2;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties2 {
// 	id: IdOrNameOrIso2OrIso3OrLocalName;
// 	name: IdOrNameOrIso2OrIso3OrLocalName;
// 	iso2: IdOrNameOrIso2OrIso3OrLocalName;
// 	iso3: IdOrNameOrIso2OrIso3OrLocalName;
// 	local_name: IdOrNameOrIso2OrIso3OrLocalName;
// 	continent: Continent;
// }
// export interface IdOrNameOrIso2OrIso3OrLocalName {
// 	type: string;
// 	format: string;
// 	description: string;
// 	name: string;
// 	isPk: boolean;
// 	isFk: boolean;
// }
// export interface Continent {
// 	type: string;
// 	format: string;
// 	enum?: (string)[] | null;
// 	name: string;
// 	isPk: boolean;
// 	isFk: boolean;
// }
// export interface Course {
// 	required?: (string)[] | null;
// 	properties: Properties3;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties3 {
// 	id: Id;
// 	school_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	name: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Employment {
// 	required?: (string)[] | null;
// 	properties: Properties4;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties4 {
// 	id: Id;
// 	teacher_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	school_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// }
// export interface Enrollment {
// 	required?: (string)[] | null;
// 	properties: Properties5;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties5 {
// 	id: Id;
// 	student_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	course_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// }
// export interface Item {
// 	description: string;
// 	required?: (string)[] | null;
// 	properties: Properties6;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties6 {
// 	id: IdOrNameOrIso2OrIso3OrLocalName;
// 	name: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	location: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// }
// export interface Location {
// 	description: string;
// 	required?: (string)[] | null;
// 	properties: Properties7;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties7 {
// 	id: IdOrNameOrIso2OrIso3OrLocalName;
// 	name: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Lyrics {
// 	required?: (string)[] | null;
// 	properties: Properties8;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties8 {
// 	id: IdOrNameOrIso2OrIso3OrLocalName;
// 	has_chords: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	lyrics: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	songtitle: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	artist: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Orderline {
// 	required?: (string)[] | null;
// 	properties: Properties9;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties9 {
// 	id: Id;
// 	owner_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	name: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	address: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	order_count: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	notes: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Participant {
// 	description: string;
// 	required?: (string)[] | null;
// 	properties: Properties10;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties10 {
// 	id: IdOrNameOrIso2OrIso3OrLocalName;
// 	name: IdOrNameOrIso2OrIso3OrLocalName;
// 	email: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	description: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	tasks: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	rvsp_ceremony: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	sort_order: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	rvsp_party: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	phone_number: StatusOrPhoneNumberOrEmailOrRole;
// }
// export interface ParticipantStatistics {
// 	properties: Properties11;
// 	type: string;
// }
// export interface Properties11 {
// 	rvsp_party: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	count: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Profiles {
// 	required?: (string)[] | null;
// 	properties: Properties12;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties12 {
// 	id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	updated_at: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	username: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	avatar_url: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// 	website: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface School {
// 	required?: (string)[] | null;
// 	properties: Properties13;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties13 {
// 	id: Id;
// 	name: TitleOrDescriptionOrAttachmentOrRvspCeremonyOrCountOrNameOrHasChordsOrLyricsOrSongtitleOrArtistOrAddressOrOrderCountOrNotesOrEmailOrTasksOrSortOrderOrRvspPartyOrUpdatedAtOrUsernameOrAvatarUrlOrWebsite;
// }
// export interface Teacher {
// 	required?: (string)[] | null;
// 	properties: Properties14;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties14 {
// 	id: Id;
// 	course_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// 	teacher_id: EnrollmentIdOrSchoolIdOrTeacherIdOrStudentIdOrCourseIdOrLocationOrOwnerIdOrId;
// }
// export interface User {
// 	properties: Properties15;
// 	type: string;
// 	titleProp: string;
// }
// export interface Properties15 {
// 	id: IdOrNameOrIso2OrIso3OrLocalName;
// 	email: StatusOrPhoneNumberOrEmailOrRole;
// 	role: StatusOrPhoneNumberOrEmailOrRole;
// }
// export interface ExternalDocs {
// 	url: string;
// 	description: string;
// }
