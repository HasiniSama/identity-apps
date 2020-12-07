/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, EmptyPlaceholder, Heading, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { AuthenticatorAccordion, getEmptyPlaceholderIllustrations } from "../../../../core";
import { IdentityProviderInterface, getIdentityProviderList } from "../../../../identity-providers";
import { updateApplicationConfigurations } from "../../../api";
import {
    ApplicationInterface,
    OutboundProvisioningConfigurationInterface,
    ProvisioningConfigurationInterface
} from "../../../models";
import { OutboundProvisioningIdpCreateWizard, OutboundProvisioningWizardIdpForm } from "../../wizard";

/**
 *  Provisioning Configurations for the Application.
 */
interface OutboundProvisioningConfigurationPropsInterface extends TestableComponentInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Current advanced configurations.
     */
    provisioningConfigurations: ProvisioningConfigurationInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Provisioning configurations form component.
 *
 * @param {ProvisioningConfigurationFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OutboundProvisioningConfiguration: FunctionComponent<OutboundProvisioningConfigurationPropsInterface> = (
    props: OutboundProvisioningConfigurationPropsInterface
): ReactElement => {

    const {
        application,
        onUpdate,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ idpList, setIdpList ] = useState<IdentityProviderInterface[]>(undefined);

    const [
        deletingIdp,
        setDeletingIdp
    ] = useState<OutboundProvisioningConfigurationInterface>(undefined);

    /**
     * Fetch the IDP list.
     */
    useEffect(() => {
        if (idpList) {
            return;
        }

        getIdentityProviderList()
            .then((response) => {
                setIdpList(response.identityProviders);
            });
    }, []);

    const addIdentityProvider = (id: string, values: any) => {
        updateApplicationConfigurations(id, values)
            .then(() => {
                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.updateApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.applications.notifications.updateApplication.success.message")
                }));

                onUpdate(application.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.updateApplication.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.updateApplication.genericError" +
                        ".message")
                }));
            });
    };

    const updateConfiguration = (values: any) => {
        const outboundConfigs: OutboundProvisioningConfigurationInterface[] =
            application?.provisioningConfigurations?.outboundProvisioningIdps;

        const editedIDP = outboundConfigs.find(idp =>
            (idp.idp === values.idp) && (idp.connector === values.connector));
        outboundConfigs.splice(outboundConfigs.indexOf(editedIDP), 1);
        outboundConfigs.push(values);
        return {
            provisioningConfigurations: {
                outboundProvisioningIdps: outboundConfigs
            }
        };
    };

    /**
     * Handles the final wizard submission.
     */
    const updateIdentityProvider = (values: any): void => {
        addIdentityProvider(application.id, updateConfiguration(values));
    };

    const handleProvisioningIDPDelete = (deletingIDP: OutboundProvisioningConfigurationInterface): void => {
        const outboundConfigs: OutboundProvisioningConfigurationInterface[] =
            application?.provisioningConfigurations?.outboundProvisioningIdps;
        outboundConfigs.splice(outboundConfigs.indexOf(deletingIDP), 1);
        const newConfig = {
            provisioningConfigurations: {
                outboundProvisioningIdps: outboundConfigs
            }
        };

        addIdentityProvider(application.id, newConfig);
        setShowDeleteConfirmationModal(false);
    };

    return (
        <>
        <Heading as="h4">
            { t("devPortal:components.applications.edit.sections.provisioning.outbound.heading") }
        </Heading>
        <Heading subHeading as="h6">
            { t("devPortal:components.applications.edit.sections.provisioning.outbound.subHeading") }
        </Heading>
        <Divider hidden/>
            {
                application?.provisioningConfigurations?.outboundProvisioningIdps?.length > 0 ? (
                    <Grid>
                        {
                            !readOnly && (
                                <Grid.Row>
                                    <Grid.Column>
                                        <PrimaryButton
                                            floated="right"
                                            onClick={ () => setShowWizard(true) }
                                            data-testid={ `${ testId }-new-idp-button` }
                                        >
                                            <Icon name="add"/>
                                            {
                                                t("devPortal:components.applications.edit.sections." +
                                                    "provisioning.outbound.actions.addIdp")
                                            }
                                        </PrimaryButton>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        }
                        <Grid.Row>
                            <Grid.Column>
                                {
                                    application?.provisioningConfigurations?.outboundProvisioningIdps?.map(
                                        (provisioningIdp) => {
                                        return (
                                            <AuthenticatorAccordion
                                                key={ provisioningIdp.idp }
                                                globalActions={
                                                    !readOnly && [
                                                        {
                                                            icon: "trash alternate",
                                                            onClick: (): void => {
                                                                setShowDeleteConfirmationModal(true);
                                                                setDeletingIdp(provisioningIdp);
                                                            },
                                                            type: "icon"
                                                        }
                                                    ]
                                                }
                                                authenticators={
                                                    [
                                                        {
                                                            content: (
                                                                <OutboundProvisioningWizardIdpForm
                                                                    initialValues={ provisioningIdp }
                                                                    triggerSubmit={ null }
                                                                    onSubmit={ (values): void => {
                                                                        updateIdentityProvider(values);
                                                                    } }
                                                                    idpList={ idpList }
                                                                    isEdit={ true }
                                                                    data-testid={ `${ testId }-form` }
                                                                />
                                                            ),
                                                            id: provisioningIdp?.idp,
                                                            title: provisioningIdp?.idp
                                                        }
                                                    ]
                                                }
                                                data-testid={ `${ testId }-outbound-connector-accordion` }
                                            />
                                        );
                                    })
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={ 8 }>
                                <Segment>
                                    <EmptyPlaceholder
                                        title={
                                            t("devPortal:components.applications.placeholders" +
                                                ".emptyOutboundProvisioningIDPs.title")
                                        }
                                        image={ getEmptyPlaceholderIllustrations().emptyList }
                                        subtitle={ [
                                            t("devPortal:components.applications.placeholders" +
                                                ".emptyOutboundProvisioningIDPs.subtitles")
                                        ] }
                                        imageSize="tiny"
                                        action={
                                            !readOnly && (
                                                <PrimaryButton onClick={ () => setShowWizard(true) }>
                                                    <Icon name="add"/>
                                                    { t("devPortal:components.applications.placeholders" +
                                                        ".emptyOutboundProvisioningIDPs.action") }
                                                </PrimaryButton>
                                            )
                                        }
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                )
            }
            {
                deletingIdp && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingIdp?.idp }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={
                                        "devPortal:components.applications.confirmations" +
                                        ".deleteOutboundProvisioningIDP.assertionHint"
                                    }
                                    tOptions={ { name: deletingIdp?.idp } }
                                >
                                    Please type <strong>{ deletingIdp?.idp }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleProvisioningIDPDelete(deletingIdp)
                        }
                        data-testid={ `${ testId }-connector-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-connector-delete-confirmation-modal-header` }
                        >
                            { t("devPortal:components.applications.confirmations.deleteOutboundProvisioningIDP" +
                                ".header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-connector-delete-confirmation-modal-message` }
                        >
                            { t("devPortal:components.applications.confirmations.deleteOutboundProvisioningIDP" +
                                ".message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-connector-delete-confirmation-modal-content` }
                        >
                            { t("devPortal:components.applications.confirmations.deleteOutboundProvisioningIDP" +
                                ".content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showWizard && (
                    <OutboundProvisioningIdpCreateWizard
                        closeWizard={ () => setShowWizard(false) }
                        application={ application }
                        onUpdate={ onUpdate }
                        data-testid={ `${ testId }-idp-create-wizard` }
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the application outbound provisioning configurations component.
 */
OutboundProvisioningConfiguration.defaultProps = {
    "data-testid": "application-outbound-provisioning-configurations"
};
