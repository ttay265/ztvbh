/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./SemanticButton'], function(SemanticButton) {
	"use strict";

	/**
	* Constructor for a new <code>ExitFullScreenAction</code>.
	* @param {string} [sId] ID for the new control, generated automatically if no ID is given
	* @param {object} [mSettings] Custom initial settings for the new control
	*
	* @class
	* A semantic-specific button, eligible for the <code>exitFullScreenAction</code> aggregation of the
	* {@link sap.f.semantic.SemanticPage} to be placed in its title.
	*
	* @extends <code>sap.f.semantic.SemanticButton</code>
	*
	* @author SAP SE
	* @version 1.48.8
	*
	* @constructor
	* @public
	* @since 1.46.0
	* @alias sap.f.semantic.ExitFullScreenAction
	* @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	*/
	var ExitFullScreenAction = SemanticButton.extend("sap.f.semantic.ExitFullScreenAction", /** @lends sap.f.semantic.ExitFullScreenAction.prototype */ {
		metadata: {
			library: "sap.f"
		}
	});

	return ExitFullScreenAction;
}, /* bExport= */ true);
