
export interface PropertyDef {
    fk: any;

    name: string

    // Extensions:
    isFk: boolean
    isPk: boolean

}

export type RelationProperties = Record<string, PropertyDef>

export interface RelationRef {
    description: string;
    properties: RelationProperties
}
export interface OpenApi {
    definitions: Definitions

    paths: Record<string, any>
}

export type Definitions = Record<string, RelationRef>

