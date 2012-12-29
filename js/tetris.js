var COLS = 10, ROWS = 20; // canvas をグリッドに見立てるための行と列の数
var board = []; // canvas をグリッドに見立てるための配列
var current, currentX, currentY; // 操作中のブロック情報, 操作中のブロックのXY座標
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
// ブロックの定義 4 x 4 のマス目で考えて、1 の部分がブロックとみなす
var colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];
// css のカラーコード名
// ブロックのインデックスと色のインデックスは対応する

function newShape() {
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[ id ];
    // 定義した shapes(ブロックの形状) から一つランダムなインデックスで取り出す。

    current = [];
    // 現在のブロック定義
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        // y 行目についての処理
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            // i を 0-15 まで変化させて、4 x 4 のグリッドに対して走査する
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
                // shape で 1 と定義されているドットに、そのインデックス+1 をセットする
                // 0 はドット無しで使うので、+1 して、取り出すときに -1 して colors のインデックスとする
            }
            else {
                current[ y ][ x ] = 0;
                // ドットなし
            }
            // shapes から選び出した shape の定義で 0 か未定義の場合はドットを 0 で埋める
        }
    }
    // 4 x 4 のマス目(ブロックのドッドの範囲)を走査するループ

    currentX = 5;
    currentY = 0;
    // ブロックを出現させる位置をセット
}

function init() {
    // 見立てたグリッドを全部 0 に初期化
    for ( var y = 0; y < ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

function tick() {
    if ( valid( 0, 1 ) ) {
        ++currentY;
        // まだ落下中だったら currentY を一つ増やす
    }
    // 操作中のブロックのY座標+1が妥当であれば処理
    else {
        freeze();
        clearLines();
        newShape();
        // 落下が終わったら固定描画をして、
        // 行のクリアを行なって、
        // 新しいブロックを生成する
    }
}

function freeze() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
                // current[y][x] に描画があったら board[y][x] に転記する
            }
        }
    }
}

function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
            // 新しいブロックの4x4グリッドの左上から右下へ
            // 古いブロックの4x4グリッドの左下から右上へ
            // 転記することで回転を表現している
        }
    }

    return newCurrent;
}

function clearLines() {
    for ( var y = ROWS - 1; y >= 0; --y ) {
        var row = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                row = false;
                break;
                // 画面グリッドを走査して、ドットが存在しない(0)だったら
                // row = false として走査終了
            }
        }
        if ( row ) {
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                    // ブロックで埋まっている行からスタートして、
                    // 一つ上の行のドットを操作中のドットに転記していくことで
                    // 一行が消えて、上のブロックが一段落ちるのを表現
                }
            }
            ++y;
            // 一段落ちた行がまた埋まっているかもしれないので
            // インデックスを一つ戻す(下に下げる)
        }
        // row = true は、その行がすべてブロックで埋まっている時
    }
}

function keyPress( key ) {
    switch ( key ) {
        case 'left':
            if ( valid( -1 ) ) {
                --currentX;
                // 現在ブロックのX位置を1減らす(左へ)
            }
            // 操作中のブロックのX座標-1が妥当であれば処理
            break;
        case 'right':
            if ( valid( 1 ) ) {
                ++currentX;
                // 現在ブロックのX位置を1増やす(右へ)
            }
            // 操作中のブロックのX座標+1が妥当であれば処理
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                ++currentY;
                // 現在ブロックのY位置を1増やす(下へ)
            }
            // 操作中のブロックのY座標+1が妥当であれば処理
            break;
        case 'rotate':
            var rotated = rotate( current );
            // rotate 関数で新しい描画座標を得る
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
                // 描画座標置き換え
            }
            // 回転させたブロックの座標が妥当であれば処理
            break;
    }
}

function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;
    // 渡された座標か現在の座標をを使う

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS
                  || x + offsetX >= COLS ) {
                    // ドットのあるY座標が board の範囲を超えている
                    // ドットのあるX座標が board の範囲を超えている
                    // すでにドットがある
                    // ドットのあるX座標が負になった
                    // ドットのあるY座標が定義した行数の最大を超えた
                    // ドットのあるX座標が定義した列数の最大を超えた
                    // 以上の時はブロックが存在できないと判定
                    return false;
                    // 存在できない座標にブロックがあった場合に false を返す
                }
            }
            // 検証したい座標のドットに 1 があった場合
        }
    }
    return true;
    // ブロックのすべてのドットが座標チェックに引っかからなければ true を返す
}

init(); // 初期化
newShape(); // 最初のブロックを生成
setInterval( tick, 250 ); // tick 関数を 250ms で実行
