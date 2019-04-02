
class ClickBox
{

  constructor(x1, y1, x2, y2)
  {
    ClickBox.occupancy_enum = Object.freeze({"O":0, "X":1, "EMPTY":3});
    this.x1 = this.y1 = this.x2 = this.y2 = -1;
    this.occupancy = ClickBox.occupancy_enum.EMPTY;
    //
    this.set_coordinates(x1, y1, x2, y2);
  }

  draw()
  {
    return 1;
  }

  set_coordinates(x1, y1, x2, y2)
  {
    this.set_x1(x1);
    this.set_y1(y1);
    this.set_x2(x2);
    this.set_y2(y2);
  }

  get_coordinates()
  {
    return{
      x1 : this.x1,
      y1 : this.y1,
      x2 : this.x2,
      y2 : this.y2
    };
  }

  set_x1(x1)
  {
    this.x1 = x1;
  }

  set_y1(y1)
  {
    this.y1 = y1;
  }

  set_x2(x2)
  {
    this.x2 = x2;
  }

  set_y2(y2)
  {
    this.y2 = y2;
  }

  set_occupancy(occupancy_status)
  {
    this.occupancy = occupancy_status;
  }

  get_occupancy_status()
  {
    return this.occupancy;
  }
}
