var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WebBlocks;
(function (WebBlocks) {
    var LayoutBuilder;
    (function (_LayoutBuilder) {
        var LayoutBuilder = (function () {
            function LayoutBuilder() {
                this.Containers = {}; //array of containers that are on the page
                this.RecycleBin = new Array(); //array of blocks added to the recycle bin
                this.BlockStorage = new Array(); //array of blocks added to the block storage
            }
            return LayoutBuilder;
        })();
        _LayoutBuilder.LayoutBuilder = LayoutBuilder;
        var Container = (function () {
            function Container() {
                this.WysiwygClass = ""; //the class to set on any wysiwyg in the container
                this.Blocks = new Array();
            }
            return Container;
        })();
        _LayoutBuilder.Container = Container;
        var Block = (function () {
            function Block() {
                this.Id = 0; //the id of the wysiwyg or block
                this.Name = ""; //the name of the block (normally shown in recycle bin or block storage)
                this.SortOrder = 0; //the sort order
                this.IsTemplateBlock = false; //whether the block is one from the template
                this.IsDeletedBlock = false; //whether the block has been deleted
                this.ViewModel = new BlockViewModel();
                this.__type = "Unknown";
            }
            return Block;
        })();
        _LayoutBuilder.Block = Block;
        var NodeBlock = (function (_super) {
            __extends(NodeBlock, _super);
            function NodeBlock() {
                _super.call(this);
                this.__type = "NodeBlock";
            }
            return NodeBlock;
        })(Block);
        _LayoutBuilder.NodeBlock = NodeBlock;
        var WysiwygBlock = (function (_super) {
            __extends(WysiwygBlock, _super);
            function WysiwygBlock() {
                _super.call(this);
                this.Content = ""; //the content of the wysiwyg
                this.__type = "WysiwygBlock";
            }
            return WysiwygBlock;
        })(Block);
        _LayoutBuilder.WysiwygBlock = WysiwygBlock;
        var BlockViewModel = (function () {
            function BlockViewModel() {
                this.Tag = "";
                this.Attributes = new Array(); //any attributes to render
                this.Classes = ""; //any classes to render
                this.Html = ""; //inner html
                this.ShouldRerender = false; //flag to rerender the view (used by the wbBlock directive)
            }
            return BlockViewModel;
        })();
        _LayoutBuilder.BlockViewModel = BlockViewModel;
        var BlockViewElementAttribute = (function () {
            function BlockViewElementAttribute(name, value) {
                this.Name = ""; //name of the attribute
                this.Value = ""; //value of the attribute
                this.Name = name;
                this.Value = value;
            }
            return BlockViewElementAttribute;
        })();
        _LayoutBuilder.BlockViewElementAttribute = BlockViewElementAttribute;
        var BlockType = (function () {
            function BlockType() {
            }
            BlockType.Wysiwyg = "WYSIWYG";
            BlockType.Node = "NODE";
            return BlockType;
        })();
        _LayoutBuilder.BlockType = BlockType;
        ;
    })(LayoutBuilder = WebBlocks.LayoutBuilder || (WebBlocks.LayoutBuilder = {})); //end of WebBlocks.LayoutBuilder
    var UI;
    (function (UI) {
        var UIState = (function () {
            function UIState(uiState) {
                this.LayoutBuilder = new LayoutBuilderState(true);
                this.IframeEditor = new IframeEditorState(false);
                Utils.PropertyHelper.CopyProperties(uiState, this);
            }
            return UIState;
        })();
        UI.UIState = UIState;
        var LayoutBuilderState = (function () {
            function LayoutBuilderState(visible) {
                this.Visible = false;
                this.Visible = visible;
            }
            return LayoutBuilderState;
        })();
        UI.LayoutBuilderState = LayoutBuilderState;
        var IframeEditorState = (function () {
            function IframeEditorState(visible) {
                this.Visible = false;
                this.Url = "";
                this.BlockId = 0;
                this.Visible = visible;
            }
            return IframeEditorState;
        })();
        UI.IframeEditorState = IframeEditorState;
        var DraggableBlockModel = (function () {
            function DraggableBlockModel() {
                this.BlockIconClass = "";
            }
            return DraggableBlockModel;
        })();
        UI.DraggableBlockModel = DraggableBlockModel;
        var Dialogs;
        (function (Dialogs) {
            var DialogTemplateProvider = (function () {
                function DialogTemplateProvider() {
                }
                DialogTemplateProvider.ContextMenuTemplate = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.ContextMenuDialog.html";
                DialogTemplateProvider.AddBlockTemplate = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.AddBlockDialog.html";
                DialogTemplateProvider.BlockStorageTemplate = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.BlockStorageDialog.html";
                DialogTemplateProvider.RecycleBinTemplate = "/app_plugins/WebBlocks/Dialogs/LayoutBuilder.RecycleBinDialog.html";
                return DialogTemplateProvider;
            })();
            Dialogs.DialogTemplateProvider = DialogTemplateProvider;
            var DialogOptionsFactory = (function () {
                function DialogOptionsFactory() {
                }
                DialogOptionsFactory.BuildContextMenuDialogOptions = function (contextMenu, callback) {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.ContextMenuTemplate,
                        show: true,
                        modalClass: 'wb-context-menu umb-modal',
                        modelData: contextMenu,
                        callback: callback
                    };
                };
                DialogOptionsFactory.BuildAddBlockDialogOptions = function (addBlockMenu) {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.AddBlockTemplate,
                        modelData: addBlockMenu,
                        show: true
                    };
                };
                DialogOptionsFactory.BuildBlockStorageDialogOptions = function (blocks) {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.BlockStorageTemplate,
                        show: true,
                        modelData: blocks
                    };
                };
                DialogOptionsFactory.BuildRecycleBinDialogOptions = function (blocks) {
                    return {
                        template: WebBlocks.UI.Dialogs.DialogTemplateProvider.RecycleBinTemplate,
                        show: true,
                        modelData: blocks
                    };
                };
                return DialogOptionsFactory;
            })();
            Dialogs.DialogOptionsFactory = DialogOptionsFactory;
            var AddBlockMenu = (function () {
                function AddBlockMenu(rootId, layoutBuilderScope) {
                    this.rootId = rootId;
                    this.layoutBuilderScope = layoutBuilderScope;
                }
                return AddBlockMenu;
            })();
            Dialogs.AddBlockMenu = AddBlockMenu;
            var ContextMenu = (function () {
                function ContextMenu(Events, EventData) {
                    if (Events === void 0) { Events = new Array(); }
                    if (EventData === void 0) { EventData = {}; }
                    this.Events = Events;
                    this.EventData = EventData;
                }
                return ContextMenu;
            })();
            Dialogs.ContextMenu = ContextMenu;
            var ContextMenuEvent = (function () {
                function ContextMenuEvent(Name, IconClass) {
                    this.Name = Name;
                    this.IconClass = IconClass;
                }
                return ContextMenuEvent;
            })();
            Dialogs.ContextMenuEvent = ContextMenuEvent;
            var ContextMenuResponse = (function () {
                function ContextMenuResponse(Event, EventData) {
                    this.Event = Event;
                    this.EventData = EventData;
                }
                return ContextMenuResponse;
            })();
            Dialogs.ContextMenuResponse = ContextMenuResponse;
            var NavigationViewModel = (function () {
                function NavigationViewModel() {
                }
                return NavigationViewModel;
            })();
            Dialogs.NavigationViewModel = NavigationViewModel;
            var NavigationViewModelViewData = (function () {
                function NavigationViewModelViewData(Id, Name, ContentType, IconClass, HasChildren) {
                    this.Id = Id;
                    this.Name = Name;
                    this.ContentType = ContentType;
                    this.IconClass = IconClass;
                    this.HasChildren = HasChildren;
                }
                return NavigationViewModelViewData;
            })();
            Dialogs.NavigationViewModelViewData = NavigationViewModelViewData;
        })(Dialogs = UI.Dialogs || (UI.Dialogs = {}));
    })(UI = WebBlocks.UI || (WebBlocks.UI = {}));
    var Utils;
    (function (Utils) {
        var PropertyHelper = (function () {
            function PropertyHelper() {
            }
            PropertyHelper.CopyProperties = function (source, target) {
                for (var prop in source) {
                    if (target[prop] !== undefined) {
                        target[prop] = source[prop];
                    }
                    else {
                        console.error("Cannot set undefined property: " + prop);
                    }
                }
            };
            return PropertyHelper;
        })();
        Utils.PropertyHelper = PropertyHelper;
        var MathHelper = (function () {
            function MathHelper() {
            }
            MathHelper.GenerateRandomNumber = function (min, max) {
                var i = 0;
                do {
                    i = Math.floor((Math.random() * max) + 1);
                } while (i < min && i > max);
                return i;
            };
            return MathHelper;
        })();
        Utils.MathHelper = MathHelper;
        var GuidHelper = (function () {
            function GuidHelper() {
            }
            GuidHelper.GenerateGuid = function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }
                return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
            };
            return GuidHelper;
        })();
        Utils.GuidHelper = GuidHelper;
    })(Utils = WebBlocks.Utils || (WebBlocks.Utils = {}));
})(WebBlocks || (WebBlocks = {}));
//# sourceMappingURL=LayoutBuilder.Models.js.map