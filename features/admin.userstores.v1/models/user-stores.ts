/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { FunctionComponent, ReactElement, SVGProps } from "react";

/**
 * Type of user store type.
 */
export interface UserStoreType {
    typeId: string;
    typeName: string;
    className: string;
    isLocal: boolean;
    self: string;
}

/**
 * Type of user store type details.
 */
export interface UserStoreTypeDetails extends UserStoreType {
    properties: UserStoreTypeProperties;
}

export interface UserStoreTypeProperties {
    Mandatory: UserStorePropertyMeta[];
    Optional: UserStorePropertyMeta[];
    Advanced: UserStorePropertyMeta[];
}

export interface UserStorePropertyMeta {
    name: string;
    defaultValue: string;
    description: string;
    attributes: PropertyAttribute[];
}

export interface PropertyAttribute {
    name: "category" | "type" | "required";
    value: string;
}

export interface UserStoreDetails {
    typeName: string;
    typeId: string;
    name: string;
    description: string;
    className: string;
    isLocal: boolean;
    properties: UserStoreProperty[];
    claimAttributeMappings: ClaimAttributeMapping[];
}

export interface UserStoreProperty {
    name: string;
    value: string;
}

export interface ClaimAttributeMapping {
    claimURI: string;
    mappedAttribute: string;
}

/**
 * Type of query param objects
 */
export interface QueryParams {
    limit: number;
    offset: number;
    filter: string;
    sort: string;
}

/**
 * Type of object returned in a userstore list
 */
export interface UserStoreListItem {
    id: string;
    name: string;
    description: string;
    self: string;
    enabled: boolean;
    isLocal?: boolean;
    typeName?: string;
    properties?: UserStoreProperty[];
}

/**
 * User store basic details object.
 */
export interface UserStoreBasicData {
    id: string;
    name: string;
    enabled?: boolean;
}

/**
 * Type of userstore list item passed as options to dropdown fields.
 */
export interface UserStoreDropdownItem {
    key: number;
    text: string;
    value: string;
}

/**
 * Type of object that is used to add or update a userstore
 */
export interface UserStorePostData {
    typeId: string;
    description: string;
    name: string;
    properties: UserStoreProperty[];
    claimAttributeMappings?: AttributeMapping[];
}

/**
 * Userstore object returned by retrieval
 */
export interface UserStore {
    id?: string;
    typeName: string;
    typeId: string;
    name: string;
    description: string;
    className: string;
    properties: UserStoreProperty[];
    claimAttributeMappings?: AttributeMapping[];
}

/**
 * Type of object passed to Test a JDBC connection
 */
export interface TestConnection {
    domain?: string;
    driverName: string;
    connectionURL: string;
    username: string;
    connectionPassword: string;
}

/**
 * Type of object return by Types list endpoint
 */
export interface TypeResponse {
    typeId: string;
    typeName: string;
    className: string;
}

/**
 * The type of properties object in Type object
 */
export interface TypeProperty {
    name: string;
    defaultValue: string;
    description: string;
    attributes: PropertyAttribute[];
    value?: string;
}

/**
 * The type of object returned by the type meta endpoint
 */
export interface UserstoreType {
    name?: string;
    typeName: string;
    typeId: string;
    isLocal?: boolean;
    className: string;
    description?: string;
    properties: {
        Mandatory: TypeProperty[];
        Optional: TypeProperty[];
        Advanced: TypeProperty[];
    };
}

/**
 * Type of patch data
 */
export interface PatchData {
    operation: string;
    path: string;
    value: string;
}

/**
 *  Model to split the property into required and optional.
 */
export interface RequiredBinary {
    required: TypeProperty[];
    optional: {
        sql: {
            insert: TypeProperty[];
            update: TypeProperty[];
            delete: TypeProperty[];
            select: TypeProperty[];
        };
        nonSql: TypeProperty[];
    };
}

/**
 * The model of the UI-level categorization of the type properties.
 */
export interface CategorizedProperties {
    user: RequiredBinary;
    connection: RequiredBinary;
    group: RequiredBinary;
    basic: RequiredBinary;
}

export enum UserstorePropertiesCategories {
    CONNECTION = "connection",
    USER = "user",
    GROUP = "group",
    BASIC = "basic"
}

/**
 * The type of object returned by the user store attributes endpoint.
 */
export interface UserStoreAttributes {
    typeName: string;
    typeId: string;
    isLocal: boolean;
    attributeMappings: AttributeMappings[];
}

/**
 * The type of attribute mappings.
 */
export interface AttributeMappings {
    claimId: string;
    claimURI: string;
    mappedAttribute: string;
    displayName: string;
}

/**
 * The type of a attribute mapping.
 */
export interface AttributeMapping {
    claimURI: string;
    mappedAttribute: string;
}

export interface UserStoreItem {
    key: number;
    text: string;
    value: string;
    disabled?: boolean;
}

/**
 * Interface for the wizard step.
 */
export interface WizardStepInterface {
    content: ReactElement;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    title: string;
    name?: string;
}
