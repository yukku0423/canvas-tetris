var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
// canvas のコンテキストの取得
var W = 300, H = 600;
// canvas のサイズ
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
// 一つあたりのブロックのサイズをセット

function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    // x,y を支点に1pxだけ少ない四角を描画
}

function render() {
    ctx.clearRect( 0, 0, W, H );
    // canvas の範囲をすべてクリアする

    ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                // board[y][x] に格納されている値-1 を色のインデックスとして扱う
                drawBlock( x, y );
            }
            // board[y][x] が 0 か undefined でない部分について描画する
        }
    }
    // 画面に存在するブロックの描画

    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                // current[y][x] に格納されている値-1 を色のインデックスとして扱う
                drawBlock( currentX + x, currentY + y );
            }
            // current[y][x] が 0 か undefined でない部分について描画する
        }
    }
    // 今操作中のブロックの描画
}

setInterval( render, 30 ); // 30ms 間隔で描画をループ
