up = 0;
down = 2;
left = 3;
right = 1;

valueOf = function (cell) {
	return cell === null ? 0 : cell.value;
}

scoreGrid = function(grid) {
	score = 0;
	largestTile = 0;
	for (var i = 0; i < grid.size; i++) {
		for (var j = 0; j < grid.size; j++) {
			value = valueOf(grid.cells[i][j]);
			if (value > largestTile) {
				largestTile = value;
			}
			// higher values on high rows are desirable
			score += (grid.size-j)*value;
			if (i+1 < grid.size) {
				otherValue = valueOf(grid.cells[i+1][j]);
				if (value === otherValue) {
					score *= 2;
				}
				if (value === otherValue/2 ||
					value === otherValue*2) {
					score *= 1.5;
				}
			}
			if (j+1 < grid.size) {
				otherValue = valueOf(grid.cells[i][j+1]);
				if (value === otherValue) {
					score *= 2;
				}
				if (value === otherValue/2 ||
					value === otherValue*2) {
					score *= 1.5;
				}
			}
		}
	}
	
	if ((valueOf(grid.cells[0][0]) === largestTile || 
	    valueOf(grid.cells[0][3]) === largestTile) && (valueOf(grid.cells[0][0]) !== valueOf(grid.cells[0][3]))) {
	    score *= 2
	}
	return score;
}

gridIf = function(direction) {
	currGrid = gm.grid.serialize();
	gm.move(direction);
	newGrid = gm.grid.serialize();
	gm.grid = new Grid(currGrid.size, currGrid.cells);
	gm.actuate()
	return newGrid;
}

bestMove = function() {
	currScore = scoreGrid(gm.grid);
	maxScore = 0;
	maxIndex = 0;
	for (var i = 0; i < gm.size; i++) {
		score = scoreGrid(gridIf(i));
		if (score > maxScore && score != currScore) {
			maxScore = score;
			maxIndex = i;
		}
	}
	return maxIndex;
}

play = function(delay) {
	(function() { 
		gm.move(bestMove()); 
		if (!gm.isGameTerminated())
			setTimeout(arguments.callee, delay); 
	})()
}