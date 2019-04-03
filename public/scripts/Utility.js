
function andmap(predicate, array)
{
  let result = true;
  for(let i = 0; i < array.length; i++)
  {
    if(!predicate(array[i]))
    {
      result = false;
      break;
    }
  }
  return result;
}

function indexes_of(array, value)
{
  let array_of_indexes = [];
  for(let i = 0; i < array.length; i++)
  {
    if(array[i] == value)
    {
      array_of_indexes.push(i);
    }
  }
  return array_of_indexes;
}
