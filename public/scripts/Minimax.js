
Minimax.boardstate_enum = Object.freeze({"INGAME" : 0, "WIN" : 1, "LOSS" : 2, "DRAW": 3});
class Minimax
{
  minimax(board, current_turn_marker, previous_turn_marker, difficulty)
  {

    function utility(minimax_node, minimax_turn)
    {

    }

    function indexes_of_empty_boxes(board)
    {
      return indexes_of(board, "");
    }

    function generate_child_boards(parent_node, marker_to_place_on_child)
    {
      let indexes_of_empty_boxes = indexes_of_empty_boxes(parent_node.get_board());
      //
      function action_function(parent_node, marker_to_place_on_child, indexes_of_empty_boxes)
      {
        if(indexes_of_empty_boxes.length == 0) //Base case.
        {
          return parent_node;
        }
        else
        {
          let child_board = parent_node.get_board().slice();
          child_board[indexes_of_empty_boxes[0]] = marker_to_place_on_child; //Mustate the proper index on the child board.
          parent_node.add_child(new MinimaxNode(child_board));
          return action_function(parent_node, marker_to_place_on_child, indexes_of_empty_boxes.slice(1));
        }
      }
      return action_function(parent_node, marker_to_place_on_child, indexes_of_empty_boxes); //Must return original root with children
    }

    function find_max(minimax_node, minimax_turn, minimax_previous_turn, depth, max_depth)
    {
      if(depth == max_depth) //Base Case.
      {
        return utility();
      }
    }

    function minimax(root_node, current_turn_marker, previous_turn_marker, depth, max_depth)
    {
      let root_after_maximization = find_max(generate_child_boards(root_node, current_turn_marker), previous_turn_marker, current_turn_marker, depth, max_depth);
      return index_of_AI_move(root_node.get_board(), root_after_maximization.get_board());
    }
    return minimax(new MinimaxNode(board), current_turn_marker, previous_turn_marker, 0, difficulty);
  }

  eval_boardstate(board, turn_marker, AI_marker)
  {
    //Local Variables
    let win_senarios = [
      [board[0], board[1], board[2]], //Top Row!
      [board[3], board[4], board[5]], //Middle Row!
      [board[6], board[7], board[8]], //Bottom Row!
      [board[0], board[3], board[6]], //First Column.
      [board[1], board[4], board[7]], //Second Column.
      [board[2], board[5], board[8]], //Third Column.
      [board[0], board[4], board[8]], //Diagnal Left to right.
      [board[2], board[4], board[6]] //Diagnal right to left.
    ];
    //Local Functions.
    function win(turn_marker, win_senarios)
    {
      function win(turn_marker, win_senarios, winner_location)
      {
        if(win_senarios.length == 0) //Base Case.
        {
          return {
            win : false,
            win_location : -1
          };
        }
        else if(andmap((marker) => marker == turn_marker, win_senarios[0]))
        {
          return {
            win : true,
            win_location : winner_location
          };
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
      if(andmap((marker) => marker.get_occupancy() != "", board))
      {
        result = true;
      }
      return result;
    }

    function evaluate(turn_marker)
    {
      let new_boardstate = Minimax.boardstate_enum.INGAME;
      //
      if(win(turn_marker, win_senarios).win)
      {
        switch(turn_marker)
        {
          case AI_marker:
            new_gamestate = Minimax.boardstate_enum.LOSS;
            break;

          default:
            new_gamestate = Minimax.boardstate_enum.WIN;
        }
      }
      else if(draw())
      {
        new_gamestate = Minimax.boardstate_enum.DRAW;
      }
      return new_gamestate;
    }
    return evaluate(turn_marker);
  }
}

class MinimaxNode
{
  constructor(board)
  {
    this.board = board;
    this.score = 0;
    this.child_boards = [];
  }

  set_board(board)
  {
    this.board = board;
  }

  get_board()
  {
    return this.board;
  }

  set_score(score)
  {
    this.score = score;
  }

  get_score()
  {
    return this.score;
  }

  set_child_boards(child_boards)
  {
    this.child_boards = child_boards;
  }

  get_child_boards()
  {
    return this.child_boards;
  }

  add_child(child_node)
  {
    this.child_boards.push(child_node);
  }
}
