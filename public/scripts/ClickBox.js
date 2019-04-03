
class ClickBox
{

  constructor(x1, y1, x2, y2)
  {
    ClickBox.occupancy_enum = Object.freeze({"O" : "O", "X" : "X", "EMPTY" : ""});
    this.x1 = this.y1 = this.x2 = this.y2 = -1;
    this.occupancy = ClickBox.occupancy_enum.EMPTY;
    //
    this.set_coordinates(x1, y1, x2, y2);
  }

  draw(canvas_context)
  {
    canvas_context.beginPath();
    canvas_context.font = ((this.get_x2() - this.get_x1()) / 1.75).toString() + "px chalk";
    canvas_context.textAlign = "center";
    canvas_context.textBaseline = "middle";
    canvas_context.fillStyle = "white";
    canvas_context.fillText(this.get_occupancy(), this.get_x(), this.get_y());
    canvas_context.closePath();
  }

  is_empty()
  {
    let is_empty = false;
    if(this.get_occupancy() == ClickBox.occupancy_enum.EMPTY)
    {
      is_empty = true;
    }
    return is_empty;
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

  get_x()
  {
    return this.get_x1() + (this.get_x2() - this.get_x1()) / 2;
  }

  get_y()
  {
    return this.get_y1() + (this.get_y2() - this.get_y1()) / 2;
  }

  set_x1(x1)
  {
    this.x1 = x1;
  }

  get_x1()
  {
    return this.x1;
  }

  set_y1(y1)
  {
    this.y1 = y1;
  }

  get_y1()
  {
    return this.y1;
  }

  set_x2(x2)
  {
    this.x2 = x2;
  }

  get_x2()
  {
    return this.x2;
  }

  set_y2(y2)
  {
    this.y2 = y2;
  }

  get_y2()
  {
    return this.y2;
  }

  set_occupancy(occupancy_status)
  {
    this.occupancy = occupancy_status;
  }

  get_occupancy()
  {
    return this.occupancy;
  }
}
