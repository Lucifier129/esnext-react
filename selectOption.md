# Select option
The following outlines the issues found and how a solution was found.

## Refs
https://github.com/facebook/react/blob/80411ea9b47a14ed3de6993fd64fba1d79ec605d/src/renderers/dom/fiber/wrappers/ReactDOMFiberSelect.js#L82
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option

There is an issue in IE/Edge where the option is not being selected based on the Select element.
This is due the the order that elements are updated, going from child to parent.

This has been updated so the props of the parent element are set before the child.

```
_.setProps(node, props, isCustomComponent)
initVchildren(velem, node, parentContext)
```

In IE/Edge the options are controlled directly from the select element. This is made obvious when using the  attribute "multiple". If we set multiple option.selected values to true, this will fail unless the select.multiple is true

# Multiple
You can't set the select.value to an array as this is being turned into an empty string in the DOM.
This has the effect of updating the option.selected to false and clearing out all selected options.

For this reason I have disabled updating select.value, if it's an array.

# Issue
There is an issue at the moment where the DOM can be different from vDOM.
If you don't update state (onChange binding on select element) when selecting an option, then checking for differences will compare the previous props vs current props. There will be no change and therefore the DOM will not be updating. As this is unlikely I have not written props develop errors for this user case.