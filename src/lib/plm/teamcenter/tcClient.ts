import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export class TcClient {
    private api: ReturnType<typeof axios.create>;

    constructor(baseUrl: string) {
        this.api = axios.create({
            baseURL: baseUrl.replace(/\/+$/, ''),
            withCredentials: true,
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN',
            timeout: 30000
        });
    }

    async login(user: string, password: string) {
        if (!user) throw new Error('Missing username');
        if (!password) throw new Error('Missing password');

        const payload = {
            header: {
                state: {},
                policy: {}
            },
            body: {
                credentials: {
                    user,
                    password,
                    role: '',
                    descrimator: '', // keep spelling as TC expects; odd but common
                    locale: '',
                    group: ''
                }
            }
        };

        await this.api.post(
            '/tc/JsonRestServices/Core-2011-06-Session/login',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
    }

    async performSearchViewModel6(term: string) {
        const payload = {
            "header": {
                "state": {
                    "clientVersion": "10000.1.2",
                    "applicationName": "Active Workspace",
                    "applicationVersion": "2506",
                    "logCorrelationID": "Advanced/8",
                    "stateless": true,
                    "enableServerStateHeaders": true,
                    "formatProperties": true,
                    "unitSystem": "As Authored",
                    "clientID": "ActiveWorkspaceClient",
                    "groupMember": "AsMAAAK9pLT5VC",
                    "role": "Designer",
                    "locale": "en_US"
                },
                "policy": {
                    "useRefCount": false,
                    "types": [
                        {
                            "name": "ChangeItemRevision",
                            "properties": [
                                {
                                    "name": "cm0DerivableTypes"
                                },
                                {
                                    "name": "CMClosure"
                                },
                                {
                                    "name": "CMDisposition"
                                },
                                {
                                    "name": "CMMaturity"
                                },
                                {
                                    "name": "items_tag"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Cm1ChangeHistoryElement",
                            "properties": [
                                {
                                    "name": "cm1SolutionItemObject"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "UserSession",
                            "properties": [
                                {
                                    "name": "cm0GlobalChangeContext"
                                },
                                {
                                    "name": "fnd0displayrule"
                                },
                                {
                                    "name": "fnd0ShowGDPR"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "WorkspaceObject",
                            "properties": [
                                {
                                    "name": "cm0AuthoringChangeRevision"
                                },
                                {
                                    "name": "owning_project"
                                },
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "fnd0InProcess"
                                },
                                {
                                    "name": "object_string"
                                },
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        },
                        {
                            "name": "Dataset",
                            "properties": [
                                {
                                    "name": "fnd0IsCheckOutForSign"
                                },
                                {
                                    "name": "checked_out_user",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "checked_out_date"
                                },
                                {
                                    "name": "release_status_list",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "fnd0InProcess"
                                },
                                {
                                    "name": "ref_list"
                                },
                                {
                                    "name": "fnd0IsCheckoutable"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "DocumentRevision",
                            "properties": [
                                {
                                    "name": "fnd0SimplifiedDocumentDS"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0WorksetRevision",
                            "properties": [
                                {
                                    "name": "fnd0StructureTypes"
                                },
                                {
                                    "name": "items_tag"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Col1AppearanceBreakdownSchm",
                            "properties": [
                                {
                                    "name": "col1AppearanceArea"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0AppSession",
                            "properties": [
                                {
                                    "name": "fnd0StructureTypesInSession"
                                },
                                {
                                    "name": "owning_user"
                                },
                                {
                                    "name": "fnd0AllowReadShare"
                                },
                                {
                                    "name": "fnd0AllowWriteShare"
                                },
                                {
                                    "name": "awb0PendingChanges"
                                },
                                {
                                    "name": "awb0LastReplayedDate"
                                },
                                {
                                    "name": "fnd0Roots"
                                },
                                {
                                    "name": "checked_out_user"
                                },
                                {
                                    "name": "checked_out_date"
                                },
                                {
                                    "name": "fnd0IsTcVisSpecific"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Awb0Element",
                            "properties": [
                                {
                                    "name": "awb0UnderlyingObject"
                                },
                                {
                                    "name": "awb0CopyStableId",
                                    "modifiers": [
                                        {
                                            "name": "excludeUiValues",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0NumberOfChildren",
                                    "modifiers": [
                                        {
                                            "name": "excludeUiValues",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0TraceLinkFlag"
                                },
                                {
                                    "name": "awb0Parent",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0Archetype"
                                },
                                {
                                    "name": "object_string"
                                },
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        },
                        {
                            "name": "Awb0ConditionalElement",
                            "properties": [
                                {
                                    "name": "awb0ArchetypeRevRelStatus",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0OverriddenProperties"
                                },
                                {
                                    "name": "awb0OverrideContexts",
                                    "modifiers": [
                                        {
                                            "name": "excludeUiValues",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0IsVi",
                                    "modifiers": [
                                        {
                                            "name": "excludeUiValues",
                                            "Value": "false"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0IsPacked"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Awb0FeatureList",
                            "properties": [
                                {
                                    "name": "awb0AvailableFeatures"
                                },
                                {
                                    "name": "awb0NonModifiableFeatures"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Awb0ProductContextInfo",
                            "properties": [
                                {
                                    "name": "awb0ContextObject",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0Product",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0CurrentRevRule",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0SupportedFeatures",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0EffDate"
                                },
                                {
                                    "name": "awb0EffUnitNo"
                                },
                                {
                                    "name": "awb0StartEffDates"
                                },
                                {
                                    "name": "awb0EndEffDates"
                                },
                                {
                                    "name": "awb0StartEffUnits"
                                },
                                {
                                    "name": "awb0EndEffUnits"
                                },
                                {
                                    "name": "awb0EffEndItem",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0UseGlobalRevisionRule"
                                },
                                {
                                    "name": "awb0EffectivityGroups",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0ClientScopeUri"
                                },
                                {
                                    "name": "awb0ViewToggles"
                                },
                                {
                                    "name": "awb0WindowStateToggles"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0ConfigurationBaseline",
                            "properties": [
                                {
                                    "name": "fnd0State"
                                },
                                {
                                    "name": "fnd0Root"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0AbsConfigBaseline",
                            "properties": [
                                {
                                    "name": "fnd0State"
                                },
                                {
                                    "name": "fnd0Root"
                                },
                                {
                                    "name": "last_mod_date"
                                },
                                {
                                    "name": "release_status_list",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ItemRevision",
                            "properties": [
                                {
                                    "name": "object_desc"
                                },
                                {
                                    "name": "is_vi"
                                },
                                {
                                    "name": "awv0IsMMVIndexed"
                                },
                                {
                                    "name": "checked_out_user",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "checked_out_date"
                                },
                                {
                                    "name": "awp0ConfiguredRevision"
                                },
                                {
                                    "name": "items_tag"
                                },
                                {
                                    "name": "release_status_list",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "fnd0InProcess"
                                },
                                {
                                    "name": "object_string"
                                },
                                {
                                    "name": "item_id"
                                },
                                {
                                    "name": "item_revision_id"
                                },
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "awb0IsDiscoveryIndexed"
                                },
                                {
                                    "name": "awb0DiscoveryIndexTime"
                                },
                                {
                                    "name": "awb0DiscoveryIndexedSource"
                                }
                            ]
                        },
                        {
                            "name": "Awb0PartElement",
                            "properties": [
                                {
                                    "name": "usg0UsageOccRev",
                                    "modifiers": [
                                        {
                                            "name": "excludeUiValues",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "awb0UnderlyingObjectType"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Awb0PositionedElement",
                            "properties": [
                                {
                                    "name": "usg0UsageOccRev",
                                    "modifiers": [
                                        {
                                            "name": "excludeUiValues",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0AbstractOccRevision",
                            "properties": [
                                {
                                    "name": "release_status_list",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0AlignedDesign",
                            "properties": [
                                {
                                    "name": "fnd0Primary"
                                },
                                {
                                    "name": "fnd0UnderlyingObject",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "fnd0IsPrimary"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0AlignedPart",
                            "properties": [
                                {
                                    "name": "fnd0Primary"
                                },
                                {
                                    "name": "fnd0UnderlyingObject",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "fnd0IsAlignmentCurrent"
                                },
                                {
                                    "name": "fnd0AlignedStatus"
                                },
                                {
                                    "name": "fnd0IsPrimary"
                                }
                            ]
                        },
                        {
                            "name": "Item",
                            "properties": [
                                {
                                    "name": "is_vi"
                                },
                                {
                                    "name": "checked_out_user",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "checked_out_date"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Ptn0PartitionLine",
                            "properties": [
                                {
                                    "name": "bl_line_object"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "TC_Project",
                            "properties": [
                                {
                                    "name": "fnd0Parent"
                                },
                                {
                                    "name": "fnd0Children"
                                },
                                {
                                    "name": "use_program_security"
                                },
                                {
                                    "name": "is_active"
                                },
                                {
                                    "name": "is_visible"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ReportDefinition",
                            "properties": [
                                {
                                    "name": "Fnd0Applicable_Assignment"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ImanSubscription",
                            "properties": [
                                {
                                    "name": "subscriber"
                                },
                                {
                                    "name": "is_modifiable"
                                },
                                {
                                    "name": "fnd0EventHandlers",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "notification",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "event_handler",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "fnd0Condition"
                                },
                                {
                                    "name": "target"
                                },
                                {
                                    "name": "attribute_names"
                                },
                                {
                                    "name": "attribute_values"
                                },
                                {
                                    "name": "logic_operators"
                                },
                                {
                                    "name": "math_operators"
                                },
                                {
                                    "name": "handler_parameters"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0NotificationTemplate",
                            "properties": [
                                {
                                    "name": "subject"
                                },
                                {
                                    "name": "message"
                                },
                                {
                                    "name": "properties"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ImanActionHandler",
                            "properties": [
                                {
                                    "name": "handler_id"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ImanEventType",
                            "properties": [
                                {
                                    "name": "eventtype_id"
                                },
                                {
                                    "name": "fnd0eventtype_name"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0Message",
                            "properties": [
                                {
                                    "name": "fnd0ApplicationType"
                                },
                                {
                                    "name": "fnd0TargetObject"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ReleaseStatus",
                            "properties": [
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "date_released"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "POM_imc",
                            "properties": [
                                {
                                    "name": "site_id"
                                },
                                {
                                    "name": "name"
                                }
                            ]
                        },
                        {
                            "name": "Form",
                            "properties": [
                                {
                                    "name": "checked_out_user",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "checked_out_date"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "User",
                            "properties": [
                                {
                                    "name": "userid"
                                },
                                {
                                    "name": "license_level"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Folder",
                            "properties": [
                                {
                                    "name": "checked_out"
                                },
                                {
                                    "name": "checked_out_user",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "PseudoFolder",
                            "properties": [
                                {
                                    "name": "owning_object"
                                },
                                {
                                    "name": "property_name"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Awp0XRTObjectSetRow",
                            "properties": [
                                {
                                    "name": "awp0Target"
                                },
                                {
                                    "name": "awp0Relation"
                                },
                                {
                                    "name": "awp0Relationship"
                                },
                                {
                                    "name": "awp0RefPropertyName"
                                },
                                {
                                    "name": "awp0RelationTypeDisplayName"
                                },
                                {
                                    "name": "awp0Primary"
                                },
                                {
                                    "name": "awp0Secondary"
                                },
                                {
                                    "name": "object_string"
                                },
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        },
                        {
                            "name": "BusinessObject",
                            "properties": [
                                {
                                    "name": "awp0CellProperties"
                                },
                                {
                                    "name": "awp0ThumbnailImageTicket"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Group",
                            "properties": [
                                {
                                    "name": "object_full_name"
                                }
                            ]
                        },
                        {
                            "name": "ImanFile",
                            "properties": [
                                {
                                    "name": "original_file_name"
                                }
                            ]
                        },
                        {
                            "name": "ImanRelation",
                            "properties": [
                                {
                                    "name": "relation_type"
                                },
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        },
                        {
                            "name": "ImanVolume",
                            "properties": [
                                {
                                    "name": "volume_name"
                                }
                            ]
                        },
                        {
                            "name": "ListOfValues",
                            "properties": [
                                {
                                    "name": "lov_name"
                                }
                            ]
                        },
                        {
                            "name": "MECfgLine",
                            "properties": [
                                {
                                    "name": "me_cl_display_string"
                                }
                            ]
                        },
                        {
                            "name": "Person",
                            "properties": [
                                {
                                    "name": "user_name"
                                }
                            ]
                        },
                        {
                            "name": "POM_user",
                            "properties": [
                                {
                                    "name": "user_name"
                                }
                            ]
                        },
                        {
                            "name": "Role",
                            "properties": [
                                {
                                    "name": "role_name"
                                }
                            ]
                        },
                        {
                            "name": "Signoff",
                            "properties": [
                                {
                                    "name": "resource_pool"
                                },
                                {
                                    "name": "decision"
                                },
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        },
                        {
                            "name": "TaskInbox",
                            "properties": [
                                {
                                    "name": "contents"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "ProposedReviewer",
                            "properties": [
                                {
                                    "name": "fnd0AssigneeUser"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "EPMTask",
                            "properties": [
                                {
                                    "name": "resource_pool"
                                },
                                {
                                    "name": "responsible_party"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "EPMTaskTemplate",
                            "properties": [
                                {
                                    "name": "template_classification"
                                },
                                {
                                    "name": "stage"
                                },
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "object_type"
                                },
                                {
                                    "name": "is_modifiable"
                                },
                                {
                                    "name": "object_string"
                                }
                            ]
                        },
                        {
                            "name": "Fnd0TableRow",
                            "properties": [
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        },
                        {
                            "name": "Awp0SearchFolder",
                            "properties": [
                                {
                                    "name": "object_string"
                                },
                                {
                                    "name": "object_type"
                                },
                                {
                                    "name": "checked_out"
                                },
                                {
                                    "name": "owning_user"
                                },
                                {
                                    "name": "owning_group"
                                },
                                {
                                    "name": "last_mod_date"
                                },
                                {
                                    "name": "release_status_list"
                                },
                                {
                                    "name": "awp0SearchDefinition"
                                },
                                {
                                    "name": "awp0SearchType"
                                },
                                {
                                    "name": "awp0CanExecuteSearch"
                                },
                                {
                                    "name": "awp0Rule"
                                },
                                {
                                    "name": "awp0IsShared"
                                }
                            ]
                        },
                        {
                            "name": "Awp0FullTextSavedSearch",
                            "properties": [
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "awp0search_string"
                                },
                                {
                                    "name": "creation_date"
                                },
                                {
                                    "name": "awp0string_filters",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "last_mod_date"
                                },
                                {
                                    "name": "awp0SearchFilterArray"
                                },
                                {
                                    "name": "owning_user"
                                },
                                {
                                    "name": "awp0is_global_shared"
                                },
                                {
                                    "name": "awp0ChartOn"
                                }
                            ]
                        },
                        {
                            "name": "SavedSearch",
                            "properties": [
                                {
                                    "name": "object_name"
                                },
                                {
                                    "name": "savedsearch_attr_names"
                                },
                                {
                                    "name": "savedsearch_attr_values"
                                },
                                {
                                    "name": "shared"
                                },
                                {
                                    "name": "last_mod_date"
                                },
                                {
                                    "name": "savedsearch_query",
                                    "modifiers": [
                                        {
                                            "name": "withProperties",
                                            "Value": "true"
                                        }
                                    ]
                                },
                                {
                                    "name": "owning_user"
                                },
                                {
                                    "name": "saved_search_criteria"
                                }
                            ]
                        },
                        {
                            "name": "SavedQueryCriteria",
                            "properties": [
                                {
                                    "name": "fnd0AttributeDisplayValues"
                                },
                                {
                                    "name": "attribute_names"
                                },
                                {
                                    "name": "attribute_values"
                                }
                            ]
                        },
                        {
                            "name": "Awp0StringSearchFilter",
                            "properties": [
                                {
                                    "name": "awp0filter_name"
                                },
                                {
                                    "name": "awp0value"
                                }
                            ]
                        },
                        {
                            "name": "Awp0AdvancedSearchInput",
                            "properties": [
                                {
                                    "name": "awp0AdvancedQueryName"
                                },
                                {
                                    "name": "awp0QuickSearchName"
                                }
                            ]
                        },
                        {
                            "name": "Xst0ExternalSystemObject",
                            "properties": [
                                {
                                    "name": "xst0DataSource"
                                },
                                {
                                    "name": "xst0DataSourceURI"
                                },
                                {
                                    "name": "xst0DataSourceID"
                                },
                                {
                                    "name": "xst0Type"
                                },
                                {
                                    "name": "xst0Name"
                                }
                            ]
                        },
                        {
                            "name": "ImanQuery",
                            "properties": [
                                {
                                    "name": "query_name"
                                },
                                {
                                    "name": "query_desc"
                                },
                                {
                                    "name": "query_class"
                                },
                                {
                                    "name": "query_flag"
                                },
                                {
                                    "name": "is_modifiable"
                                }
                            ]
                        }
                    ]
                }
            },
            "body": {
                "searchInput": {
                    "maxToLoad": 50,
                    "maxToReturn": 50,
                    "providerName": "Awp0SavedQuerySearchProvider",
                    "searchCriteria": {
                        "queryUID": "AkAAAAgUpLT5VC",
                        "typeOfSearch": "ADVANCED_SEARCH",
                        "lastEndIndex": "",
                        "totalObjectsFoundReportedToClient": "",
                        "ItemID": term,
                        "searchID": new Date().getTime().toString(),
                        "utcOffset": "-300",
                        "checkThreshold": "1"
                    },
                    "searchFilterFieldSortType": "Priority",
                    "startIndex": 0,
                    "searchFilterMap6": {},
                    "searchSortCriteria": [],
                    "attributesToInflate": [],
                    "internalPropertyName": "",
                    "columnFilters": [],
                    "cursor": {
                        "startIndex": 0,
                        "endIndex": 0,
                        "startReached": false,
                        "endReached": false
                    },
                    "focusObjUid": "",
                    "pagingType": ""
                },
                "inflateProperties": false,
                "columnConfigInput": {
                    "clientName": "",
                    "hostingClientName": "",
                    "clientScopeURI": "",
                    "operationType": "",
                    "columnsToExclude": []
                },
                "saveColumnConfigData": {
                    "scope": "",
                    "scopeName": "",
                    "clientScopeURI": "",
                    "columnConfigId": "",
                    "columns": []
                },
                "noServiceData": false
            }
        };
        const res = await this.api.post(
            '/tc/RestServices/Internal-AWS2-2025-06-Finder/performSearchViewModel6',
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return res.data;
    }



    async request<T = any>(cfg: AxiosRequestConfig): Promise<T> {
        const res = await this.api.request<T>(cfg);
        return res.data;
    }
}
