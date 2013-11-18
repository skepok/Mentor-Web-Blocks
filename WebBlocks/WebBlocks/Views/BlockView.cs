﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.HtmlControls;
using Umbraco.Core;
using Umbraco.Web;
using WebBlocks.Utilities.WebBlocks;
using umbraco.cms.businesslogic.macro;
using umbraco.cms.businesslogic.web;
using umbraco.NodeFactory;
using WebBlocks.BusinessLogic.Interfaces;
using WebBlocks.Views.RenderingEngines;
using WebBlocks.Model;
using CacheHelper = WebBlocks.Utilities.Cache.CacheHelper;
using umbraco.BusinessLogic;
using umbraco.presentation.preview;
using System.Xml;
using Umbraco.Core.Models;
using Umbraco.Web.Models;
using WebBlocks.Utilities.Umbraco;
using System.IO;
using System.Web.Mvc.Html;

namespace WebBlocks.Views
{
    public class BlockView
    {
        /// <summary>
        /// Renders the block
        /// </summary>
        /// <returns>rendered html for the block</returns>
        public void Render(Block block, HtmlHelper html, bool renderContainer = true)
        {
            if (!HttpContext.Current.Response.IsClientConnected)
                return;

            if (block is NodeBlock)
                RenderNodeBlock(block as NodeBlock, html, renderContainer);
            else
                RenderWysiwygBlock(block as WysiwygBlock, html);
        }

        protected void RenderNodeBlock(NodeBlock block, HtmlHelper html, bool renderContainer)
        {
            IRenderingEngine renderingEngine = ResolveRenderingEngine(block);

            //if rendering engine is null then the document doesn't exist anymore
            if (renderingEngine == null) return;

            //set the block model for the view to access
            WebBlocksUtility.CurrentBlockContent = block.Content;

            string blockIdAttribute = WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", block.Id) : "";
            string blockTemplateAttribute = WebBlocksUtility.IsInBuilder ? 
                string.Format(" templateblock='{0}'", block.IsTemplateBlock.ToString().ToLower()) : "";
            string blockDeletedAttribute = WebBlocksUtility.IsInBuilder && block.IsDeleted ? " deletedBlock='deleted' style='display:none;visibilty:hidden;'" : "";

            //render
            string renderedContent = renderingEngine.Render(html);

            List<string> CssClasses = CacheHelper.Get<List<string>>("wbCssClasses") ?? new List<string>();

            string blockClass = string.Format("{0}{1}{0}{2}{3}{4}", 
                block.Class.Length > 0 ? " " : "", 
                block.Class,
                WebBlocksUtility.CurrentBlockContent.GetPropertyValue("cssClasses"),
                CssClasses.Count() > 0 ? " " : "",
                String.Join(" ", CssClasses));
            blockClass = WebBlocksUtility.IsInBuilder ? "block " + blockClass : blockClass;

            if (renderContainer)
                renderedContent = string.Format("<div class='{0}'{1}{2}{3}>{4}</div>", 
                    blockClass, blockIdAttribute, blockTemplateAttribute, blockDeletedAttribute, renderedContent);

            html.ViewContext.Writer.Write(renderedContent);
        }

        protected void RenderWysiwygBlock(WysiwygBlock block, HtmlHelper html)
        {
            string webBlocksId = WebBlocksUtility.IsInBuilder ? string.Format(" wbid='{0}'", block.Id) : "";

            string blockClass = string.Format("pageWysiwygBlock{0}{1}", block.Class.Length > 0 ? " " : "", block.Class);

            blockClass = WebBlocksUtility.IsInBuilder ? "block " + blockClass : blockClass;

            string blockTemplateAttribute = WebBlocksUtility.IsInBuilder ?
                string.Format(" templateblock='{0}'", block.IsTemplateBlock.ToString().ToLower()) : "";
            string blockDeletedAttribute = WebBlocksUtility.IsInBuilder && block.IsDeleted ? " deletedBlock='deleted' style='display:none;visibilty:hidden;'" : "";

            html.ViewContext.Writer.Write("<div{0} class='{1}'{2}{3}>{4}</div>", webBlocksId, blockClass, blockTemplateAttribute, blockDeletedAttribute,
                HttpUtility.UrlDecode(block.Content));
        }

        protected IRenderingEngine ResolveRenderingEngine(NodeBlock block)
        {
            try
            {
                Document blockDoc = new Document(block.Id);

                //resolve with partial view
                IRenderingEngine engine = new PartialViewRenderingEngine
                {
                    Macro = new MacroModel(new Macro { ScriptingFile = blockDoc.ContentType.Alias })
                };

                return engine;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public void RenderPreview(HtmlHelper html)
        {
            var blockContent = WebBlocksUtility.CurrentBlockContent;
            string renderedBlock = html.Partial(blockContent.DocumentTypeAlias, null).ToHtmlString();

            List<string> CssClasses = CacheHelper.Get<List<string>>("wbCssClasses") ?? new List<string>();
            string htmlContent = string.Format("<div class='block {0}{1}' wbid='{2}'>", blockContent.GetProperty("cssClasses").Value,
                " " + String.Join(" ", CssClasses), blockContent.Id);
            htmlContent += renderedBlock;
            htmlContent += "</div>";

            html.ViewContext.Writer.Write(htmlContent);
        }
    }
}