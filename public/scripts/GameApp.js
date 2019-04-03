
class GameApp
{
    constructor()
    {
      //Class Variables.
      GameApp.turn_enum = Object.freeze({"AI" : "O", "PLAYER" : "X"});
      GameApp.gamestate_enum = Object.freeze({"INGAME" : 0, "WIN" : 1, "LOSS" : 2, "DRAW": 3});
      GameApp.winner_location_enum = Object.freeze({"TOP" : 0, "MIDDLE" : 1, "BOTTOM" : 2, "LEFT" : 3, "CENTER" : 4, "RIGHT" : 5, "DIAGLEFT" : 6, "DIAGRIGHT" : 7});
      //Instance Variables.
      this.$canvas = null;
      this.canvas_context = null;
      this.board = null;
      this.current_turn = undefined;
      this.difficulty = -1;
      this.gamestate = undefined;
      this.winner_location = undefined;
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
      //
      if(this.get_gamestate() == GameApp.gamestate_enum.WIN || this.get_gamestate() == GameApp.gamestate_enum.LOSS)
      {
        this.render_winner_indicator();
      }
    }

    render_bar(x1, y1, x2, y2)
    {
      let canvas_context = this.get_canvas_context();
      canvas_context.beginPath();
      canvas_context.lineWidth = "15";
      canvas_context.strokeStyle = "white";
      canvas_context.moveTo(x1, y1);
      canvas_context.lineTo(x2, y2);
      canvas_context.stroke();
      canvas_context.closePath();
    }

    render_winner_indicator()
    {
      let location = this.get_winner_location();
      let canvas_context = this.get_canvas_context();
      let canvas_size = this.get_canvas_size();
      canvas_context.beginPath();
      canvas_context.lineWidth = "10";
      canvas_context.strokeStyle = "yellow";
      switch(location)
      {
        case GameApp.winner_location_enum.TOP:
          canvas_context.moveTo(0, this.get_clickbox(0).get_y() - 10);
          canvas_context.lineTo(canvas_size, this.get_clickbox(0).get_y() - 10);
          break;

        case GameApp.winner_location_enum.MIDDLE:
          this.winner_location = GameApp.winner_location_enum.MIDDLE;
          canvas_context.moveTo(0, this.get_clickbox(3).get_y() - 10);
          canvas_context.lineTo(canvas_size, this.get_clickbox(3).get_y() - 10);
          break;

        case GameApp.winner_location_enum.BOTTOM:
          this.winner_location = GameApp.winner_location_enum.BOTTOM;
          canvas_context.moveTo(0, this.get_clickbox(6).get_y() - 10);
          canvas_context.lineTo(canvas_size, this.get_clickbox(6).get_y() - 10);
          break;

        case GameApp.winner_location_enum.LEFT:
          this.winner_location = GameApp.winner_location_enum.LEFT;
          canvas_context.moveTo(this.get_clickbox(0).get_x(), 0);
          canvas_context.lineTo(this.get_clickbox(0).get_x(), canvas_size);
          break;

        case GameApp.winner_location_enum.CENTER:
          this.winner_location = GameApp.winner_location_enum.CENTER;
          canvas_context.moveTo(this.get_clickbox(1).get_x(), 0);
          canvas_context.lineTo(this.get_clickbox(1).get_x(), canvas_size);
          break;

        case GameApp.winner_location_enum.RIGHT:
          this.winner_location = GameApp.winner_location_enum.RIGHT;
          canvas_context.moveTo(this.get_clickbox(2).get_x(), 0);
          canvas_context.lineTo(this.get_clickbox(2).get_x(), canvas_size);
          break;

        case GameApp.winner_location_enum.DIAGLEFT:
          this.winner_location = GameApp.winner_location_enum.DIAGLEFT;
          canvas_context.moveTo(38, 32);
          canvas_context.lineTo(canvas_size - 24, canvas_size - 32);
          break;

        case GameApp.winner_location_enum.DIAGRIGHT:
          canvas_context.moveTo(canvas_size - 38, 32);
          canvas_context.lineTo(24, canvas_size - 32);
      }
      canvas_context.stroke();
      canvas_context.closePath();
    }

    setup_mouse_event()
    {
      this.get_canvas().on("mouseup", this.process_player_click.bind(this));
    }

    process_player_click(event)
    {
      if(this.get_gamestate() == GameApp.gamestate_enum.INGAME && this.get_current_turn() == GameApp.turn_enum.PLAYER)
      {
        let mouse_coordinates, click_index, clickbox;
        mouse_coordinates = this.get_canvas_mouse_coordinates(event);
        click_index = this.map_click_to_index(mouse_coordinates.x, mouse_coordinates.y);
        if(this.get_clickbox(click_index).is_empty())
        {
          this.place_marker(click_index, ClickBox.occupancy_enum.X);
          this.swap_turns();
        }
      }
    }

    process_ai()
    {
      if(this.get_difficulty() == 0)
      {
        this.place_marker(this.get_random_clickbox_index(), ClickBox.occupancy_enum.O);
      }
      else
      {

      }
      this.swap_turns();
    }

    get_random_clickbox_index()
    {
      let empty_indexes = this.get_empty_clickbox_indexes();
      return empty_indexes[Math.floor(Math.random() * empty_indexes.length)];
    }

    get_empty_clickbox_indexes()
    {
      return indexes_of(this.get_board().to_char(), ClickBox.occupancy_enum.EMPTY);
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

    place_marker(index, occupancy_status)
    {
      this.set_clickbox_occupancy(index, occupancy_status);
    }
/*
    eval_gamestate(turn_marker)
    {
      //Local Variables
      let clickboxes = this.get_board().get_clickbox_array();
      let win_senarios = [
        [clickboxes[0].get_occupancy(), clickboxes[1].get_occupancy(), clickboxes[2].get_occupancy()], //Top Row!
        [clickboxes[3].get_occupancy(), clickboxes[4].get_occupancy(), clickboxes[5].get_occupancy()], //Middle Row!
        [clickboxes[6].get_occupancy(), clickboxes[7].get_occupancy(), clickboxes[8].get_occupancy()], //Bottom Row!
        [clickboxes[0].get_occupancy(), clickboxes[3].get_occupancy(), clickboxes[6].get_occupancy()], //First Column.
        [clickboxes[1].get_occupancy(), clickboxes[4].get_occupancy(), clickboxes[7].get_occupancy()], //Second Column.
        [clickboxes[2].get_occupancy(), clickboxes[5].get_occupancy(), clickboxes[8].get_occupancy()], //Third Column.
        [clickboxes[0].get_occupancy(), clickboxes[4].get_occupancy(), clickboxes[8].get_occupancy()], //Diagnal Left to right.
        [clickboxes[2].get_occupancy(), clickboxes[4].get_occupancy(), clickboxes[6].get_occupancy()] //Diagnal right to left.
      ];
      let game_app_ref = this;
      //Local Functions.
      function win(turn_marker, win_senarios)
      {
        function win(turn_marker, win_senarios, winner_location)
        {
          if(win_senarios.length == 0) //Base Case.
          {
            return false;
          }
          else if(andmap((marker) => marker == turn_marker, win_senarios[0]))
          {
            game_app_ref.set_winner_location(winner_location);
            return true;
          }
          else
          {
            return win(turn_marker, win_senarios.slice(1, win_senarios.length), winner_location + 1);
          }
        }
        return win(turn_marker, win_senarios, 0);
      }

      function draw()
      {
        let result = false;
        if(andmap((clickbox) => clickbox.get_occupancy() != "", clickboxes))
        {
          result = true;
        }
        return result;
      }

      function evaluate(turn_marker)
      {
        let new_gamestate = GameApp.gamestate_enum.INGAME;
        //
        if(win(turn_marker, win_senarios))
        {
          switch(turn_marker)
          {
            case GameApp.turn_enum.AI:
              new_gamestate = GameApp.gamestate_enum.LOSS;
              break;

            case GameApp.turn_enum.PLAYER:
              new_gamestate = GameApp.gamestate_enum.WIN;
          }
        }
        else if(draw())
        {
          new_gamestate = GameApp.gamestate_enum.DRAW;
        }
        return new_gamestate;
      }
      return evaluate(turn_marker);
    }*/

    eval_gamestate(minimax_boardstate)
    {
      let new_gamestate = undefined;
      switch(minimax_boardstate)
      {
        case Minimax.boardstate_enum.INGAME:
          GameApp.gamestate_enum.INGAME;
          break;

        case Minimax.boardstate_enum.DRAW:
          GameApp.gamestate_enum.DRAW;
          break;

        case Minimax.boardstate_enum.LOSS:
          GameApp.gamestate_enum.LOSS;
          break;

        case Minimax.boardstate_enum.WIN:
          GameApp.gamestate_enum.WIN;
      }
    }

    swap_turns()
    {
      let gamestate_after_turn = this.eval_gamestate(Minimax.eval_boardstate(this.get_board().to_char(), this.get_current_turn(), GameApp.turn_enum.AI));
      this.set_gamestate(gamestate_after_turn);
      if(gamestate_after_turn == GameApp.gamestate_enum.INGAME)
      {
        if(this.get_current_turn() == GameApp.turn_enum.PLAYER)
        {
          this.set_current_turn(GameApp.turn_enum.AI);
          this.process_ai();
        }
        else
        {
          this.set_current_turn(GameApp.turn_enum.PLAYER);
        }
      }
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

    set_winner_location(winner_location)
    {
      let winner_location_array = ["TOP", "MIDDLE", "BOTTOM", "LEFT", "CENTER", "RIGHT", "DIAGLEFT", "DIAGRIGHT"];
      let enumeration_value = winner_location_array[winner_location];
      switch(enumeration_value)
      {
        case "TOP":
          this.winner_location = GameApp.winner_location_enum.TOP;
          break;

        case "MIDDLE":
          this.winner_location = GameApp.winner_location_enum.MIDDLE;
          break;

        case "BOTTOM":
          this.winner_location = GameApp.winner_location_enum.BOTTOM;
          break;

        case "LEFT":
          this.winner_location = GameApp.winner_location_enum.LEFT;
          break;

        case "CENTER":
          this.winner_location = GameApp.winner_location_enum.CENTER;
          break;

        case "RIGHT":
          this.winner_location = GameApp.winner_location_enum.RIGHT;
          break;

        case "DIAGLEFT":
          this.winner_location = GameApp.winner_location_enum.DIAGLEFT;
          break;

        case "DIAGRIGHT":
          this.winner_location = GameApp.winner_location_enum.DIAGRIGHT;
      }
    }

    get_winner_location()
    {
      return this.winner_location;
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

    set_clickbox_occupancy(index, occupancy_status)
    {
      this.get_board().set_clickbox_occupancy(index, occupancy_status);
    }

    get_clickbox_occupancy(index)
    {
      return this.get_board().get_clickbox_occupancy(index);
    }
}
