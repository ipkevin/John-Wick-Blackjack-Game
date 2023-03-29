import React from 'react';

export function TicTacToeBoard({ ctx, G, moves}) {
    const onClick = (id) => moves.clickCell(id);

    let winner = '';
    if (ctx.gameover) {
        winner = ctx.gameover.winner !== undefined ? (
            <div id="winner">Winner: {ctx.gameover.winner}</div>
        ) : ( <div id="winner">Draw!</div>);
    }

    const cellStyle = {
        border: '1px solid #555',
        width: '50px',
        height: '50px',
        lineHeight: '50px',
        textAlign: 'center',
    };

    let tbody = [];
    for (let i = 0; i < 3; i++) {
        let cells = [];
        for (let j = 0; j < 3; j++) {
            const id = 3 * i + j;
            cells.push(
                <td key={id}>
                    {G.cells[id] ? (
                        <div style={cellStyle}>{G.cells[id]}</div>
                    ) : (
                        <button style={cellStyle} onClick={() => onClick(id)} />
                    )}
                </td>
            );
        }
        tbody.push(<tr key={i}>{cells}</tr>);
    }

    return (
    <div>
      <table id="board">
        <tbody>{tbody}</tbody>
      </table>
      {winner}
    </div>
    );
}