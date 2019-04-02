
class Board
{
  constructor(size)
  {
    this.clickbox_array = [];
    this.size = -1;
    this.total_clickboxes = -1;
    this.set_board_size(size);
    this.set_total_clickboxes(9);
    this.set_clickbox_array();
  }

  set_clickbox_array()
  {
    let x1, y1, x2, y2, coordinate_incrementer, total_clickboxes;
    x1 = y1 = 0;
    x2 = y2 = coordinate_incrementer = this.get_board_size() / 3;
    total_clickboxes = 9;
    for(let row = 0; row < parseInt(total_clickboxes / 3); row++)
    {
      for(let column = 0; column < parseInt(total_clickboxes / 3); column++)
      {
        this.clickbox_array.push(new ClickBox(x1, y1, x2, y2));
        x1 += coordinate_incrementer;
        x2 += coordinate_incrementer;
      }
      x1 = 0;
      x2 = coordinate_incrementer;
      y1 += coordinate_incrementer;
      y2 += coordinate_incrementer;
    }
  }

  get_clickbox_array()
  {
    return this.clickbox_array;
  }

  get_clickbox(index)
  {
    return this.get_clickbox_array()[index];
  }

  set_board_size(size)
  {
    this.size = size;
  }

  get_board_size()
  {
    return this.size;
  }

  set_total_clickboxes(number_of_clickboxes)
  {
    this.total_clickboxes = number_of_clickboxes;
  }

  get_total_clickboxes()
  {
    return this.total_clickboxes;
  }
}
