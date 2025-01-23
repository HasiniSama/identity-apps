/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalFormField, SelectFieldAdapter, TextFieldAdapter } from "@wso2is/form/src";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { ActionsConstants } from "../constants/actions-constants";
import {
    AuthenticationType,
    AuthenticationTypeDropdownOption,
    EndpointConfigFormPropertyInterface
} from "../models/actions";
import "./action-endpoint-config-form.scss";

interface ActionEndpointConfigFormInterface extends IdentifiableComponentInterface {
    /**
     * Action's initial values.
     */
    initialValues: EndpointConfigFormPropertyInterface;
    /**
     * Specifies action creation state.
     */
    isCreateFormState: boolean;
    /**
     * Callback function triggered when the authentication type is changed.
     *
     * @param updatedValue - The new authentication type selected.
     * @param change - Indicates whether the change is detected.
     */
    onAuthenticationTypeChange:  (updatedValue: AuthenticationType, change: boolean) => void;
}

const ActionEndpointConfigForm: FunctionComponent<ActionEndpointConfigFormInterface> = ({
    initialValues,
    isCreateFormState,
    onAuthenticationTypeChange,
    [ "data-componentid" ]: _componentId = "action-endpoint-config-form"
}: ActionEndpointConfigFormInterface): ReactElement => {

    const actionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.actions);
    const [ authenticationType, setAuthenticationType ] = useState<AuthenticationType>(null);
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);
    const [ isShowSecret1, setIsShowSecret1 ] = useState<boolean>(false);
    const [ isShowSecret2, setIsShowSecret2 ] = useState<boolean>(false);
    const hasActionUpdatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.update);
    const hasActionCreatePermissions: boolean = useRequiredScopes(actionsFeatureConfig?.scopes?.create);

    const { t } = useTranslation();

    const getFieldDisabledStatus = (): boolean => {
        if (isCreateFormState) {
            return !hasActionCreatePermissions;
        } else {
            return !hasActionUpdatePermissions;
        }
    };

    /**
     * The following useEffect is used to set the current Action Authentication Type.
     */
    useEffect(() => {
        if (!initialValues) {
            setIsAuthenticationUpdateFormState(true);
        } else {
            setAuthenticationType(initialValues?.authenticationType as AuthenticationType);
            setIsAuthenticationUpdateFormState(false);
        }
    }, [ initialValues ]);

    const renderInputAdornmentOfSecret = (showSecret: boolean, onClick: () => void): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !showSecret ? "eye" : "eye slash" }
                data-componentid={ `${ _componentId }-authentication-property-secret1-view-button` }
                onClick={ onClick }
            />
        </InputAdornment>
    );

    const handleAuthenticationChange = (): void => {
        onAuthenticationTypeChange(initialValues?.authenticationType as AuthenticationType, true);
        setIsAuthenticationUpdateFormState(true);
    };

    const handleAuthenticationChangeCancel = (): void => {
        onAuthenticationTypeChange(initialValues?.authenticationType as AuthenticationType, false);
        setAuthenticationType(initialValues?.authenticationType as AuthenticationType);
        setIsAuthenticationUpdateFormState(false);
    };

    const renderAuthenticationSection = (): ReactElement => {
        const renderAuthenticationSectionInfoBox = (): ReactElement => {
            const resolveAuthTypeDisplayName = (): string => {
                switch (authenticationType) {
                    case AuthenticationType.NONE:
                        return t("actions:fields.authentication.types.none.name");
                    case AuthenticationType.BASIC:
                        return t("actions:fields.authentication.types.basic.name");
                    case AuthenticationType.BEARER:
                        return t("actions:fields.authentication.types.bearer.name");
                    case AuthenticationType.API_KEY:
                        return t("actions:fields.authentication.types.apiKey.name");
                    default:
                        return;
                }
            };

            return (
                <Alert className="alert-nutral" icon={ false }>
                    <AlertTitle
                        className="alert-title"
                        data-componentid={ `${_componentId}-authentication-info-box-title` }
                    >
                        <Trans
                            i18nKey={
                                authenticationType === AuthenticationType.NONE ?
                                    t("actions:fields.authentication.info.title.noneAuthType") :
                                    t("actions:fields.authentication.info.title.otherAuthType",
                                        { authType: resolveAuthTypeDisplayName() } )
                            }
                            components={ { strong: <strong/> } }
                        />
                    </AlertTitle>
                    <Trans
                        i18nKey={ t("actions:fields.authentication.info.message") }
                    >
                        If you are changing the authentication, be aware that the authentication secrets of
                        the external endpoint need to be updated.
                    </Trans>
                    <div>
                        <Button
                            onClick={ handleAuthenticationChange }
                            variant="outlined"
                            size="small"
                            className={ "secondary-button" }
                            data-componentid={ `${_componentId}-change-authentication-button` }
                            disabled={ getFieldDisabledStatus() }
                        >
                            { t("actions:buttons.changeAuthentication") }
                        </Button>
                    </div>
                </Alert>
            );
        };

        const renderAuthenticationUpdateWidget = (): ReactElement => {
            const renderAuthentication = (): ReactElement => {
                const renderAuthenticationPropertyFields = (): ReactElement => {
                    const showAuthSecretsHint = (): ReactElement => (
                        <Hint className="hint-text" compact>
                            {
                                isCreateFormState ?
                                    t("actions:fields.authenticationType.hint.create")
                                    : t("actions:fields.authenticationType.hint.update")
                            }
                        </Hint>
                    );

                    switch (authenticationType) {
                        case AuthenticationType.NONE:
                            break;
                        case AuthenticationType.BASIC:
                            return (
                                <>
                                    { showAuthSecretsHint() }
                                    <FinalFormField
                                        key="username"
                                        width={ 16 }
                                        className="text-field-container"
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        ariaLabel="username"
                                        required={ true }
                                        data-componentid={ `${_componentId}-authentication-property-username` }
                                        name="usernameAuthProperty"
                                        type={ isShowSecret1 ? "text" : "password" }
                                        InputProps={ {
                                            endAdornment: renderInputAdornmentOfSecret(
                                                isShowSecret1,
                                                () => setIsShowSecret1(!isShowSecret1))
                                        } }
                                        label={ t("actions:fields.authentication" +
                                            ".types.basic.properties.username.label") }
                                        placeholder={ t("actions:fields.authentication" +
                                            ".types.basic.properties.username.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        disabled={ getFieldDisabledStatus() }
                                    />
                                    <FinalFormField
                                        key="password"
                                        className="text-field-container"
                                        width={ 16 }
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        ariaLabel="password"
                                        required={ true }
                                        data-componentid={ `${_componentId}-authentication-property-password` }
                                        name="passwordAuthProperty"
                                        type={ isShowSecret2 ? "text" : "password" }
                                        InputProps={ {
                                            endAdornment: renderInputAdornmentOfSecret(
                                                isShowSecret2,
                                                () => setIsShowSecret2(!isShowSecret2))
                                        } }
                                        label={ t("actions:fields.authentication" +
                                            ".types.basic.properties.password.label") }
                                        placeholder={ t("actions:fields.authentication" +
                                            ".types.basic.properties.password.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        disabled={ getFieldDisabledStatus() }
                                    />
                                </>
                            );
                        case AuthenticationType.BEARER:
                            return (
                                <>
                                    { showAuthSecretsHint() }
                                    <FinalFormField
                                        key="accessToken"
                                        className="text-field-container"
                                        width={ 16 }
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        ariaLabel="accessToken"
                                        required={ true }
                                        data-componentid={ `${_componentId}-authentication-property-accessToken` }
                                        name="accessTokenAuthProperty"
                                        type={ isShowSecret1 ? "text" : "password" }
                                        InputProps={ {
                                            endAdornment: renderInputAdornmentOfSecret(
                                                isShowSecret1,
                                                () => setIsShowSecret1(!isShowSecret1))
                                        } }
                                        label={ t("actions:fields.authentication" +
                                            ".types.bearer.properties.accessToken.label") }
                                        placeholder={ t("actions:fields.authentication" +
                                            ".types.bearer.properties.accessToken.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        disabled={ getFieldDisabledStatus() }
                                    />
                                </>
                            );
                        case AuthenticationType.API_KEY:
                            return (
                                <>
                                    { showAuthSecretsHint() }
                                    <FinalFormField
                                        key="header"
                                        className="text-field-container"
                                        width={ 16 }
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        ariaLabel="header"
                                        required={ true }
                                        data-componentid={ `${_componentId}-authentication-property-header` }
                                        name="headerAuthProperty"
                                        type={ "text" }
                                        label={ t("actions:fields.authentication" +
                                            ".types.apiKey.properties.header.label") }
                                        placeholder={ t("actions:fields.authentication" +
                                            ".types.apiKey.properties.header.placeholder") }
                                        helperText={ (
                                            <Hint className="hint" compact>
                                                { t("actions:fields.authentication" +
                                                    ".types.apiKey.properties.header.hint") }
                                            </Hint>
                                        ) }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        disabled={ getFieldDisabledStatus() }
                                    />
                                    <FinalFormField
                                        key="value"
                                        className="text-field-container"
                                        width={ 16 }
                                        FormControlProps={ {
                                            margin: "dense"
                                        } }
                                        ariaLabel="value"
                                        required={ true }
                                        data-componentid={ `${_componentId}-authentication-property-value` }
                                        name="valueAuthProperty"
                                        type={ isShowSecret2 ? "text" : "password" }
                                        InputProps={ {
                                            endAdornment: renderInputAdornmentOfSecret(
                                                isShowSecret2,
                                                () => setIsShowSecret2(!isShowSecret2))
                                        } }
                                        label={ t("actions:fields.authentication" +
                                            ".types.apiKey.properties.value.label") }
                                        placeholder={ t("actions:fields.authentication" +
                                            ".types.apiKey.properties.value.placeholder") }
                                        component={ TextFieldAdapter }
                                        maxLength={ 100 }
                                        minLength={ 0 }
                                        disabled={ getFieldDisabledStatus() }
                                    />
                                </>
                            );
                        default:
                            break;
                    }
                };

                const handleAuthTypeChange = (event: SelectChangeEvent) => {
                    switch (event.target.value) {
                        case AuthenticationType.NONE.toString():
                            setAuthenticationType(AuthenticationType.NONE);
                            onAuthenticationTypeChange(AuthenticationType.NONE, true);

                            break;
                        case AuthenticationType.BASIC.toString():
                            setAuthenticationType(AuthenticationType.BASIC);
                            onAuthenticationTypeChange(AuthenticationType.BASIC, true);

                            break;
                        case AuthenticationType.BEARER.toString():
                            setAuthenticationType(AuthenticationType.BEARER);
                            onAuthenticationTypeChange(AuthenticationType.BEARER, true);

                            break;
                        case AuthenticationType.API_KEY.toString():
                            setAuthenticationType(AuthenticationType.API_KEY);
                            onAuthenticationTypeChange(AuthenticationType.API_KEY, true);

                            break;
                        default:
                            setAuthenticationType(AuthenticationType.NONE);
                            onAuthenticationTypeChange(AuthenticationType.NONE, true);
                    }

                    renderAuthenticationPropertyFields();
                };

                return (
                    <>
                        <FinalFormField
                            key="authenticationType"
                            className="select-field-container"
                            width={ 16 }
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            ariaLabel="username"
                            required={ true }
                            data-componentid={ `${_componentId}-authentication-type-dropdown` }
                            name="authenticationType"
                            type={ "dropdown" }
                            displayEmpty={ true }
                            label={ t("actions:fields.authenticationType.label") }
                            placeholder={ t("actions:fields.authenticationType.placeholder") }
                            component={ SelectFieldAdapter }
                            maxLength={ 100 }
                            minLength={ 0 }
                            options={
                                [ ...ActionsConstants.AUTH_TYPES.map(
                                    (option: AuthenticationTypeDropdownOption) => ({
                                        text: t(option.text),
                                        value: option.value.toString()
                                    }))
                                ]
                            }
                            onChange={ handleAuthTypeChange }
                            disabled={ getFieldDisabledStatus() }
                        />
                        { renderAuthenticationPropertyFields() }
                    </>
                );
            };

            return (
                <Box className="box-container">
                    <div className="box-field">
                        { renderAuthentication() }
                        { !isCreateFormState && (
                            <Button
                                onClick={ handleAuthenticationChangeCancel }
                                variant="outlined"
                                size="small"
                                className="secondary-button"
                                data-componentid={ `${_componentId}-cancel-edit-authentication-button` }
                            >
                                { t("actions:buttons.cancel") }
                            </Button>
                        ) }
                    </div>
                </Box>
            );
        };

        return (!isAuthenticationUpdateFormState && !isCreateFormState && !(authenticationType === null) ?
            renderAuthenticationSectionInfoBox() : renderAuthenticationUpdateWidget());
    };

    return (
        <>
            <FinalFormField
                key="uri"
                className="text-field-container"
                width={ 16 }
                FormControlProps={ {
                    margin: "dense"
                } }
                ariaLabel="endpointUri"
                required={ true }
                data-componentid={ `${_componentId}-action-endpointUri` }
                name="endpointUri"
                type="text"
                label={ t("actions:fields.endpoint.label") }
                placeholder={ t("actions:fields.endpoint.placeholder") }
                helperText={ (
                    <Hint className="hint" compact>
                        { t("actions:fields.endpoint.hint") }
                    </Hint>
                ) }
                component={ TextFieldAdapter }
                maxLength={ 100 }
                minLength={ 0 }
                disabled={ getFieldDisabledStatus() }
            />
            <Divider className="divider-container"/>
            <Typography variant="h6" className="heading-container" >
                { t("actions:fields.authentication.label") }
            </Typography>
            { renderAuthenticationSection() }
        </>
    );
};

export default ActionEndpointConfigForm;
