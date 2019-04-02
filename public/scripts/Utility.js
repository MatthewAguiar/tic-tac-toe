
function isHTMLNode(node_object)
{
  let isNode = false;
  if(node_object instanceof Node)
  {
    isNode = true;
  }
  return isNode;
}

function isjQueryObject($jQuery_object)
{
  let isjQuery = false;
  if($jQuery_object instanceof jQuery)
  {
    isjQuery = true;
  }
  return isjQuery;
}
