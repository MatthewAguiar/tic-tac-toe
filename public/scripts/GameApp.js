
class GameApp
{
    constructor()
    {
      //Class Variables.
      GameApp.turn_enum = Object.freeze({"AI":0, "PLAYER": 1});
      GameApp.gamestate_enum = Object.freeze({"INGAME":0, "WIN":1, "LOSS":2});
      //Instance Variables.
      this.$canvas = null;
      this.canvas_context = null;
      this.board = null;
      this.current_turn = undefined;
      this.difficulty = -1;
      this.gamestate = undefined;
      //Set the GameApp's properties.
      this.set_canvas($("#game-board"));
      this.set_canvas_context();
      this.setup_mouse_event();
      this.init_game();
      this.draw_board();
      console.log(this.get_board());
    }

    init_game()
    {
      this.set_board();
      this.set_current_turn(GameApp.turn_enum.PLAYER);
      this.set_difficulty(0);
      this.set_gamestate(GameApp.gamestate_enum.INGAME);
    }

    draw_board()
    {
      let canvas_context = this.get_canvas_context();
      let canvas_size = this.get_canvas_size();
      requestAnimationFrame(this.draw_board.bind(this));
      canvas_context.clearRect(0, 0, this.get_canvas_size(), this.get_canvas_size());
      this.render_bar(0, canvas_size / 3, canvas_size, canvas_size / 3);
      this.render_bar(0, canvas_size * (2 / 3), canvas_size, canvas_size * (2 / 3));
      this.render_bar(canvas_size / 3, 0, canvas_size / 3, canvas_size);
      this.render_bar(canvas_size * (2 / 3), 0, canvas_size * (2 / 3),  canvas_size);
      let total_clickboxes = this.get_total_clickboxes();
      for(let i = 0; i < total_clickboxes; i++)
      {
          this.get_clickbox(i).draw(canvas_context);
      }
    }

    render_bar(x1, y1, x2, y2)
    {
      let canvas_context = this.get_canvas_context();
      canvas_context.beginPath();
      canvas_context.lineWidth = "10";
      canvas_context.strokeStyle = "white";
      canvas_context.moveTo(x1, y1);
      canvas_context.lineTo(x2, y2);
      canvas_context.stroke();
      canvas_context.closePath();
    }

    setup_mouse_event()
    {
      this.get_canvas().on("mouseup", this.process_player_click.bind(this));
    }

    process_player_click(event)
    {
      let mouse_coordinates = this.get_canvas_mouse_coordinates(event);
      if(this.get_gamestate() == GameApp.gamestate_enum.INGAME)
      {
        let index = this.map_click_to_index(mouse_coordinates.x, mouse_coordinates.y);
        console.log(index);
      }
    }

    get_canvas_mouse_coordinates(event)
    {
      let canvas_bounds = this.get_canvas_as_Node().getBoundingClientRect();
      return {
        x: event.clientX - canvas_bounds.left,
        y: event.clientY - canvas_bounds.top
      };
    }

    map_click_to_index(x, y)
    {
      let index = -1;
      for(let i = 0; i < this.get_total_clickboxes(); i++)
      {
        let clickbox_coordinates, clicked;
        clickbox_coordinates = this.get_clickbox(i).get_coordinates();
        clicked = (x >= clickbox_coordinates.x1 && x < clickbox_coordinates.x2) && (y >= clickbox_coordinates.y1 && y < clickbox_coordinates.y2);
        if(clicked)
        {
          index = i;
          break;
        }
      }
      return index;
    }

    swap_turns()
    {
      let turn_state = undefined;
      if(this.get_current_turn() == GameApp.turn_enum.PLAYER)
      {
        turn_state = GameApp.turn_enum.AI;
      }
      else
      {
        turn_state = GameApp.turn_enum.PLAYER;
      }
      this.set_current_turn(turn_state);
    }

    set_current_turn(turn_state)
    {
      this.current_turn = turn_state;
    }

    get_current_turn()
    {
      return this.current_turn;
    }

    set_canvas($canvas_object)
    {
      this.$canvas = $canvas_object;
      this.$canvas.attr("width", parseInt(this.$canvas.css("width")));
      this.$canvas.css("height", this.$canvas.css("width"));
      this.$canvas.attr("height", parseInt(this.$canvas.css("height")));
    }

    get_canvas()
    {
      return this.$canvas;
    }

    get_canvas_as_Node()
    {
      return this.$canvas[0];
    }

    get_canvas_size()
    {
      return this.get_canvas().attr("width");
    }

    set_canvas_context()
    {
      this.canvas_context = this.get_canvas()[0].getContext("2d");
    }

    get_canvas_context()
    {
      return this.canvas_context;
    }

    set_board()
    {
      this.board = new Board(this.get_canvas_size());
    }

    get_board()
    {
      return this.board;
    }

    set_difficulty(difficulty)
    {
      this.difficulty = difficulty;
    }

    get_difficulty()
    {
      return this.difficulty;
    }

    set_gamestate(gamestate)
    {
      this.gamestate = gamestate;
    }

    get_gamestate()
    {
      return this.gamestate;
    }

    //Delegated Functions
    get_total_clickboxes()
    {
      return this.get_board().get_total_clickboxes();
    }

    get_clickbox(index)
    {
      return this.get_board().get_clickbox(index);
    }
}
