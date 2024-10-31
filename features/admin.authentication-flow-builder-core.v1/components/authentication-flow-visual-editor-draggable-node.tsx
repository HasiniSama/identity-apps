/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Avatar from "@oxygen-ui/react/Avatar";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import DraggableNode from "./draggable-node";
import { Component } from "../models/components";
import { Primitive } from "../models/primitives";
import "./authentication-flow-visual-editor-draggable-node.scss";

/**
 * Props interface of {@link AuthenticationFlowVisualEditorDraggableNode}
 */
export interface AuthenticationFlowVisualEditorDraggableNodePropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    node: Component | Primitive;
}

/**
 * Draggable node for the visual editor.
 *
 * @param props - Props injected to the component.
 * @returns Draggable Visual Editor node component.
 */
const AuthenticationFlowVisualEditorDraggableNode: FunctionComponent<
    AuthenticationFlowVisualEditorDraggableNodePropsInterface
> = ({
    "data-componentid": componentId = "authentication-flow-visual-editor-draggable-node",
    id,
    node,
    ...rest
}: AuthenticationFlowVisualEditorDraggableNodePropsInterface): ReactElement => {
    return (
        <DraggableNode
            key={ id }
            node={ (node as unknown) as Record<string, unknown> }
            data-componentid={ componentId }
            { ...rest }
        >
            <Card className="authentication-flow-visual-editor-draggable-node">
                <CardContent>
                    <Stack direction="row" spacing={ 1 }>
                        <Avatar
                            src={ node?.display?.image }
                            variant="square"
                            className="authentication-flow-visual-editor-draggable-node-avatar"
                        />
                        <Typography>{ node?.display?.label?.fallback }</Typography>
                    </Stack>
                </CardContent>
            </Card>
        </DraggableNode>
    );
};

export default AuthenticationFlowVisualEditorDraggableNode;
