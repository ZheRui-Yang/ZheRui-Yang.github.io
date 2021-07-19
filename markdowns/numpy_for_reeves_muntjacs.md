---
title: 山羌也能懂的 — NumPy
---

[![][numpy-logo]][numpy]

NumPy （ Numerical Python ）是被廣泛應用在各項工程、科學領域的 Python 函式庫（ library ），也是 PyData 和 Python 在科學領域應用系統的核心 — Pandas 、 SciPy 、 Matplotlib 、 scikit-learn 、 scikit-image 等等資料科學或其他科學領域的 Python 套件內都能見到 NumPy 的應用程式接口（ API ）。  
NumPy 的主要內容為一個描述多維陣列與矩陣的資料結構 — **ndarray**類型（ class ）— 一個均質的（ homogeneous ）、可為一維或高維的陣列物件。

[numpy-logo]: https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/NumPy_logo_2020.svg/512px-NumPy_logo_2020.svg.png
[numpy]: https://numpy.org/

# 為什麼要用 NumPy ？
NumPy 的主要物件 `numpy.ndarray`{.python} 將 Python 程式碼「向量化」（ vectorize ），帶來以下好處：

- 避免迷失在 for 迴圈的迷宮之中
- 讓程式碼閱讀更直覺、更輕鬆
- 精簡程式碼 — 更短的程式碼代表更少的錯誤

使用 Pandas 、 SciPy 、 Matplotlib 、 scikit-learn 、 scikit-image 等等的套件時都能見到 NumPy 的身影。

NumPy 的底層由 C 語言寫成，這代表在面對大資料量或高維度的場景時，NumPy 將會比純 Python 更快完成任務。

<!--
TODO: vectorize??
TODO: before vectorize, 2-D arrays do inner product.
-->

# 真正開始之前...
## 先備知識
雖然目標是寫給毫無經驗的大家看的，不過畢竟是第三方套件（ package ），再怎樣簡化也有個底限。由於這是專門用來做數值運算的 Python 套件，數學與程式方面各需要一點點概念才能順暢的理解：

- 程式方面
  - 基礎 Python — 官方有個不錯的[教學][py-tutorial]，本文會用到的概念是 for 迴圈、函式、類別（ type ）與串列
  - 陣列 — 就把它想像成固定長度、所有元素也統一類別的 Python 串列就好
  - 張量（ tensor ）在任何程式語言的實作概念

- 數學方面
  - 張量的「形狀」
  - 內積、外積與矩陣轉置

當然，不見得以上知識都通曉才能閱讀，但若懂的話我保證這份文件對你毫無障礙。對於絕大部分的內容，我相信只要上面列舉的各項都有個概念就夠了。

<!--
TODO: what is tensor - 0-D to n-D
TODO: how to implement tensor
-->

[py-tutorial]: https://docs.python.org/zh-tw/3/tutorial/

## 書寫慣例
本文力求直覺簡單，但仍有些風格相關的書寫格式可以了解一下。  

容易混淆的、從字面上比較難懂的、以及自創詞會在該詞中文第一次出現時在後方括號裡附上原文，例如上方的類型（ class ）與類別（ type ）。每當我寫到「類型」時就不會是「類別」，反之亦然。另外 NumPy 與 Python 這種專有名詞我會保留原文。

接下來會大量提到 NumPy 的函式與物件。在本文提到的應用程式接口都是不完整的，但在第一次介紹時我會附上其官方文件的連結。官方文件裡會對該應用程式接口做完整、詳盡的介紹，有興趣者請隨連結查閱。

內文與標題會有一些使用等寬、無裝飾、且帶有底色的英文字串，那些字代表你可以在 Python 程式碼手稿（ script ）或互動式殼層（ interactive shell ）裡用完全相同的語句參照（ reference ）到該物件、又或是代表程式語言相關的字詞（例如：`int`{.python} 類別），或者終端機（ terminal ）指令。另外，內文與標題的模組（ module ）名稱會是全名，跟程式碼區塊中的有所不同。底下安裝與匯入一節有做說明。

為行文方便，我有時會把 `numpy.ndarray`{.python} 稱為陣列，閱讀時請稍加留意。

Python 程式碼範例的部份，考慮到精簡、易懂與泛用，本文會使用原生互動式殼層相似的書寫格式：

- `>>>`{.bash} 代表人手輸入的第一行
- `...`{.bash} 出現在行首時代表人手輸入的第二行之後，用於表示一行沒有完成的程式碼區塊
- 程式輸出會直接靠著行首，沒有提示

例如：

```{.python}
>>> for i in range(3):
...     print(i)
...
0
1
2
```

一個 `>>>`{.python} 後面連接零個到數個 `...`{.python} 標示一個完整的指令。

最後，應用程式接口的解說裡，若參數（ argument ）後面未加等號 `=`{.python} 為位置參數，若有出現則其出現的位置會影響它的意思。中括弧內的位置參數可省略不寫，它們是被設計成有預設值的位置參數。   
而參數後面有等號 `=`{.python} 的參數稱為關鍵字參數，其擺放位置只限制在所有位置參數之後，次序無所謂。關鍵字參數的等號後面接的值正是預設值，若不想改動預設值可不必明文寫出。  
例如：   

```{.python}  
range([start, ]stop[, step])
```

表示 `range`{.python} 函數有三個位置參數，其中 `start`{.python} 與 `step`{.python} 可省略。

## 安裝與匯入
### 安裝
NumPy 可以由 `conda`{.bash} 或 `pip`{.bash} 套件管理器[安裝][installation]、由 MacOS 或 Linux 的套件管理器安裝，或者是從[原始碼][source]安裝。

- 經由 `conda`{.bash}  
  ```{.bash}
  conda install numpy
  ```

- 經由 `pip`{.bash}   
  ```{.bash}
  pip install numpy
  ```

使用 MacOS 或 Linux 套件管理器安裝的朋友請洽自己的套件管理器文件，若是使用 Anaconda 或 Colab 寫程式的朋友則不須安裝。


[installation]: https://numpy.org/install/
[source]: https://numpy.org/devdocs/user/building.html

### 匯入
使用以下語句匯入：

```{.python}
import numpy as np
```

將 NumPy 匯入成 `np`{.bash} 這個代號（ alias ）已是不成文的規矩，但不強制。接下來所有的 Python 程式碼區塊裡我們將預設 NumPy 已被匯入為 `np`{.bash} 。

# 什麼是 [`numpy.ndarray`{.python}][ndarray]
NumPy 的主要物件 — `numpy.ndarray`{.python} 是一個均質且多維的陣列，各維度的子陣列（在該維度內）長度均一、所有元素皆為同一類別。  
在 NumPy 中維度被稱為「 軸（ axis ） 」。

```{.python}
>>> np.array([1, 2, 3, 4], dtype=np.int32)
array([1, 2, 3, 4], dtype=int32)
```

當然也可以多維，這裡是一個二維的 `numpy.ndarray`{.python} ：

```{.python}
>>> np.fromfunction(lambda x, y: 10 * x + y, (5, 4), dtype=int)
array([[ 0,  1,  2,  3],
       [10, 11, 12, 13],
       [20, 21, 22, 23],
       [30, 31, 32, 33],
       [40, 41, 42, 43]])
```

上例中第一個軸長度為 5 ，第二個軸長度為 4 。

需要注意的是，每個維度裡的元素**長度必須均一**！這裡是個不均一的例子：

```{.python}
>>> np.array([[1, 2, 3],
...           [4, 5, 6, 7]])
<stdin>:1: VisibleDeprecationWarning: Creating an ndarray from ragged nested sequences (which is a list-or-tuple of lists-or-tuples-or ndarrays with different
lengths or shapes) is deprecated. If you meant to do this, you must specify 'dtype=object' when creating the ndarray.
array([list([1, 2, 3]), list([4, 5, 6, 7])], dtype=object)
```

我們可以看到出來的結果的元素類型是 `object`{.python} ，NumPy 自動將不等長的串列保持原樣輸入。如此一來就成為一個一維、長度二的陣列（內含兩個串列物件），各維度元素長度保持均一，因此是個合理的結果。不過合理歸合理，若我們的本意是要各 `int`{.python} 元素做運算，這個地方就會出問題。  
所以除非這是我們刻意為之，盡可能先確認各維度內長度一致。

接下來介紹 `numpy.ndarray`{.python} 幾個良好特性：

- 元素導向（ Elementwise ）的算符運算   
  算術運算子（ Arithmetic operator  ）所描述的運算（ $+$ 、 $-$ 、 $\times$ 、 $\div$ ... 等等 ）會被適用在所有元素，且若是兩個相同形狀（ shape ）的 `numpy.ndarray`{.python} 做算術運算結果會是兩陣列相對的元素各自做運算。   

  ```{.python}
  >>> np.array([1, 3, 4]) + np.array([4, 3, 1])
  array([5, 6, 5])
  ```

- 魔術般的切片（ slicing ）   
  ```{.python}
  >>> a = np.array([[ 1,  2,  3,  4,  5],
  ...               [11, 12, 13, 14, 15],  # 切片區塊: [12, 13, 14, 15]
  ...               [21, 22, 23, 24, 25],  #           [22, 23, 24, 25]
  ...               [31, 32, 33, 34, 45],
  ...               [41, 42, 43, 44, 45],
  ...               [51, 52, 53, 54, 55]])
  >>> a[1:3, 1:]
  array([[12, 13, 14, 15],
         [22, 23, 24, 25]])
  ```

- 變形金剛般的重塑（ Reshape ）   
  ```{.python}
  >>> a = np.array([[ 1,  2,  3,  4,  5],  # 原本是一個 5x5 矩陣（二軸 numpy.ndarray ）
  ...               [11, 12, 13, 14, 15],
  ...               [21, 22, 23, 24, 25],
  ...               [31, 32, 33, 34, 45],
  ...               [41, 42, 43, 44, 45],
  ...               [51, 52, 53, 54, 55]])
  >>> a.reshape(2, 3, 5)  # 變成兩個 3x5 矩陣（三軸 numpy.ndarray ）
  array([[[ 1,  2,  3,  4,  5],
          [11, 12, 13, 14, 15],
          [21, 22, 23, 24, 25]],
  
         [[31, 32, 33, 34, 45],
          [41, 42, 43, 44, 45],
          [51, 52, 53, 54, 55]]])
  ```

- 超專業的線性代數操作   
  ```{.python}
  >>> a = np.array([[1 ,2 ,3],
  ...               [4, 5, 6],
  ...               [7, 8, 9]])
  >>> i = np.array([[1, 0, 0],
  ...               [0, 1, 0],
  ...               [0, 0, 1]])
  >>> a @ i  # 矩陣內積
  array([[1, 2, 3],
         [4, 5, 6],
         [7, 8, 9]])
  ```

- 子彈般的執行速度   
  - [Official explaination: Why is NumPy fast?](https://numpy.org/doc/stable/user/whatisnumpy.html#why-is-numpy-fast) - The NumPy community  
  - [Pure Python vs NumPy vs TensorFlow Performance Comparison](https://realpython.com/numpy-tensorflow-performance/) - by RealPython

重要的 `numpy.ndarray`{.python} 屬性   

  | 屬性                     | 意思                                              |
  |:-------------------------|:--------------------------------------------------|
  | `numpy.ndarray.ndim`     | 有幾個軸                                          |
  | `numpy.ndarray.shape`    | 每個軸的資料長度                                  |
  | `numpy.ndarray.size`     | 共有多少個元素                                    |
  | `numpy.ndarray.dtype`    | 元素的資料類別，可為 Python 內建類別或 NumPy 類別 |
  | `numpy.ndarray.itemsize` | 整個陣列在記憶體中佔多少位元組                    |

```{.python}
>>> c = np.arange(24).reshape(2, 3, 4)
>>> c
array([[[ 0,  1,  2,  3],
        [ 4,  5,  6,  7],
        [ 8,  9, 10, 11]],

       [[12, 13, 14, 15],
        [16, 17, 18, 19],
        [20, 21, 22, 23]]])
>>> c.ndim
3
>>> c.shape
(2, 3, 4)
>>> c.size
24
>>> c.dtype
dtype('int64')
>>> c.itemsize
8
```


[ndarray]: https://numpy.org/doc/stable/reference/arrays.ndarray.html

# 如何建立 `numpy.ndarray`{.python} ？
NumPy 提供相當多方式建構一個 `numpy.ndarray`{.python} 這裡介紹三大類方法：

- 借助 [`numpy.array`{.python}][array] 函式  
  身為一個類型， `numpy.ndarray`{.python} 當然可以透過呼叫取得 `numpy.ndarray`{.python} 的實例（ instance ），但語法相對不直覺。 NumPy 提供一個函式能夠輕鬆的建立 `numpy.ndarray`{.python} ，即「 `numpy.array`{.python} 」。
- 借助其他輔助函式   
  這裡介紹：[`numpy.eye`{.python}][eye] 、 [`numpy.zeros`{.python}][zeros] 、與 [`numpy.arange`{.python}][arange]
- 其他方式  
  這裡介紹：[`numpy.copy`{.python}][copy]


[array]:https://numpy.org/doc/stable/reference/generated/numpy.array.html#numpy.array
[eye]:https://numpy.org/doc/stable/reference/generated/numpy.eye.html
[zeros]:https://numpy.org/doc/stable/reference/generated/numpy.zeros.html
[arange]:https://numpy.org/doc/stable/reference/generated/numpy.arange.html
[copy]:https://numpy.org/doc/stable/reference/generated/numpy.copy.html
[fromfunction]:https://numpy.org/doc/stable/reference/generated/numpy.fromfunction.html
[fromstring]:https://numpy.org/doc/stable/reference/generated/numpy.fromstring.html#numpy.fromstring

## 借助 [`numpy.array`{.python}][array] 函式 
這是最單純的創建方式。將類陣列（ [array_like][array_like] ）的物件傳入第一個位置參數，該物件將描述陣列的「外觀」；第二個位置參數（ `dtype`{.python} ）用於指定元素的類別，不一定要給，若是沒指定 NumPy 會猜測最適合的類別。

用法：  `numpy.array(object, dtype=None)`{.python}

`object`{.python} 可為以下類別： `list`{.python} ， `tuple`{.python} ， `numpy.ndarray`{.python} ， ... 等等（或甚至 `str`{.python} ）。
`dtype`{.python} 可能為 Python 內建類別（ `int`{.python}, `float`{.python} 等等）或是任意 [`numpy.dtype`{.python}][dtype] 。

```{.python}
>>> np.array([(1, 2), (3, 4)])
array([[1, 2],
       [3, 4]])
```

需要注意的是，`numpy.array`{.python} 只接受一個到兩個位置參數，而定義「形狀」的位置參數位於第一個位置參數。我們不能一股腦地將元素直接倒進 `numpy.array`{.python} ，而是要將元素先包成一包再丟入 `numpy.array`{.python} 。

```{.python}
>>> np.array([1, 2, 3, 4, 5])  # 正確
array([1, 2, 3, 4, 5])
>>> np.array(1, 2, 3, 4, 5)  # 錯誤
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: array() takes from 1 to 2 positional arguments but 5 were given
```

利用 `numpy.array`{.python} 建立陣列時可以同時指定類別：

```{.python}
>>> np.array([1.23, 2.7, 3.14], dtype=int)
array([1, 2, 3])
```

不指定類型時， NumPy 會依據元素猜測該給予怎麼樣的類別給陣列。猜測的原則簡單講是「在可描述所有元素的情況下，最精準的那個」。

```{.python}
>>> np.array([[1, 2, 3],
...           [3, 2j, 2]])  # 這行有個「 2j 」，NumPy 猜這個陣列要用複數（ complex ）描述
array([[1.+0.j, 2.+0.j, 3.+0.j],
       [3.+0.j, 0.+2.j, 2.+0.j]])
```


[array_like]: https://numpy.org/doc/stable/glossary.html#term-array_like
[dtype]: https://numpy.org/doc/stable/reference/arrays.dtypes.html

## 借助其他輔助函式 
### [`numpy.arange`{.python}][arange]   
藉由定義數字元素起始點、終點、與間距以獲得一個一維數字陣列。  
用法: `numpy.arange([start, ]stop[, step], dtype=None)`{.python}  
`start`{.python} 、 `stop`{.python} 、與 `step`{.python} 可以是任意實數。

若省略 `start`{.python} ，預設值將會是 0 ；若省略 `step`{.python} 預設值將會是 1 。  
`numpy.arange`{.python} 的行為基本上與 `range`{.python} 一致，除了它會回傳完整的 `numpy.ndarray`{.python} 物件而不是 `range`{.python} 這個迭代器（ iterator ）物件。

```{.python}
>>> np.arange(5)
array([0, 1, 2, 3, 4])
```

```{.python}
>>> np.arange(3, 10, 2, dtype=float)
array([3., 5., 7., 9.])
```

有趣的是，我們可以將 `step`{.python} 設為一個浮點數（ `float`{.python} ），如此一來就能收到一個間距是浮點數的陣列。

```{.python}
>>> np.arange(0, 1, .3)
array([0. , 0.3, 0.6, 0.9])
```

不過由於浮點數精確度並不穩定的問題，並不推薦使用這種方法。 若有這種需求，請洽 [`numpy.linspace`{.python}](https://numpy.org/doc/stable/reference/generated/numpy.linspace.html) 。


### [`numpy.eye`{.python}][eye]   
建立一個對角線為 1 其餘為 0 的二維陣列，但是兩個維度的長度及對角線的上下偏移都各自可調整。   
用法:  `numpy.eye(N, M=None, k=0, dtype=<class 'float'>)`{.python}  
N 須為整數，指定第一維度的長度（也就是有幾列）。  
M 須為整數，指定第二維度的長度（也就是有幾行）。若省略則預設與 N 相同。  
k 須為整數，指定對角線 1 的偏移量。正值為往上偏移，負值則向下。若省略或設為零則由 $(0, 0)$ 開始。

```{.python}
>>> np.eye(3)
array([[1., 0., 0.],
       [0., 1., 0.],
       [0., 0., 1.]])
```

將對角線的 1 向下偏移兩次：  

```{.python}
>>> np.eye(5, 4, -2, dtype=int)
array([[0, 0, 0, 0],
       [0, 0, 0, 0],
       [1, 0, 0, 0],
       [0, 1, 0, 0],
       [0, 0, 1, 0]])
```
  
相似 `numpy.eye`{.python} 的函式還有 [`numpy.identity`{.python}](https://numpy.org/doc/stable/reference/generated/numpy.identity.html) ，會製作一個單位矩陣（ identity metrix ）。

### [`numpy.zeros`{.python}][zeros]   
製作一個全部元素均為 0 的多維陣列，通常拿來初始化特定形狀的陣列。  
用法：  `numpy.zeros(shape, dtype=float)`{.python}  

`shape`{.python} 可為一個整數或一個整數數列（記得要打包在一起）。

```{.python}
>>> np.zeros([3, 3], dtype=int)
array([[0, 0, 0],
       [0, 0, 0],
       [0, 0, 0]])
```

類似 `numpy.zeros`{.python} 的函式還有 `numpy.ones`{.python} 與 `numpy.full`{.python} ，一個填充 1 ，另一個的填充物由我們指定。

## 其他方式
[`numpy.copy`{.python}][copy]   
複製一份陣列。  
用法：  `numpy.copy(a)`{.python}  

這個函式等效於 `numpy.ndarray.copy`{.python} 。  
另外請注意以上兩者的複製僅止於淺層複製（ shallow copy ），若需要真正的將整個物件複製（深層複製（deep copy ））請洽 `copy.deepcopy`{.python} 。

```{.python}
>>> g = np.arange(3)
>>> g2 = g
>>> g3 = np.copy(g)
>>> g3[0] = 12
>>> g2[0] == g[0]
True
>>> g3[0] == g[0]
False
```

# `numpy.ndarray`{.python} 被印出時的反應
一維陣列被印出時會與串列相同：

```{.python}
>>> print(np.array([1, 2, 3]))
[1 2 3]
```

二維陣列被印出時會將元素對齊：

```{.python}
>>> print(np.array([[1, 1, 1], [1, 1, 1]]))
[[1 1 1]
 [1 1 1]]
```

三維陣列被印出時會將第一維用空行隔開：

```{.python}
>>> print(np.arange(18).reshape((2, 3, 3)))
[[[ 0  1  2]
  [ 3  4  5]
  [ 6  7  8]]

 [[ 9 10 11]
  [12 13 14]
  [15 16 17]]]
```

要是陣列太大 NumPy 會自動跳過中間，只顯示角落的數值：

```{.python}
>>> print(np.arange(10000).reshape(100, 100))
[[   0    1    2 ...   97   98   99]
 [ 100  101  102 ...  197  198  199]
 [ 200  201  202 ...  297  298  299]
 ...
 [9700 9701 9702 ... 9797 9798 9799]
 [9800 9801 9802 ... 9897 9898 9899]
 [9900 9901 9902 ... 9997 9998 9999]]
```


# 基本操作
算術運算子會應用到每個元素上：

```{.python}
>>> np.array([1, 2, 3]) + 4  # 陣列加上一個整數
array([5, 6, 7])
>>> h = np.array([[0, 1, 2],
...               [1, 1, 3],
...               [2, 3, 4]])
>>> h2 = np.array([[-2, -2, -2],
...                [-2, -2, -2],
...                [-2, -2, -2]])
>>> h - h2  # 相同大小的陣列減法
array([[2, 3, 4],
       [3, 3, 5],
       [4, 5, 6]])
>>> h3 = np.array([[0, 1, 2],
...                [3, 4, 5],
...                [6, 7, 8]])
>>> h4 = h3 > 5  # 邏輯運算也沒問題
>>> h4
array([[False, False, False],
       [False, False, False],
       [ True,  True,  True]])
```

Numpy 讓一維陣列相加減的寫法變得相當有意義，因為這正是向量相加減的數學寫法。另外這個特性也讓我們在需要將整個矩陣做某個偏移時免去手動撰寫迴圈的麻煩。

不過熟悉線性代數的朋友一定想問：「啊你把乘法算符拿去做元素導向的乘法了，內外積該不會要我自己動手？」

「交給我！」NumPy 說道。

```{.python}
>>> np.array([1, 2, 3]) @ np.array([3, 2, 1])  # 內積
10
>>> np.outer(np.array([1, 2]), np.array([3, 4]))  # 外積
array([[3, 4],
       [6, 8]])
```

程式語言裡面方便的原地（ in-place ）算符也有：

```{.python}
>>> i = np.array([1, 2, 3])
>>> i += 4
>>> i
array([5, 6, 7])
```

若兩個不同類別的陣列或數字做運算， NumPy 也會跟創建 `numpy.ndarray`{.python} 時一樣，自動去猜測結果的類別：

```{.python}
>>> j = np.ones(10, dtype=int)
>>> j2 = np.linspace(0, 3, 10, dtype=float)
>>> j3 = j + j2
>>> j3.dtype
dtype('float64')
```

許多一元運算（ unary operation ）（如 `sum`{.python} ）都有實作在 `numpy.ndarray`{.python} 上：

```{.python}
>>> k = np.array([[4, 3, 6, 7],
...               [1, 9, 1, 7],
...               [7, 3, 4, -5]])
>>> k.sum()
47
>>> k.min()
-5
>>> k.max()
9
```

這些一元運算都能指定一個軸，若有指定則會照著指定軸的方向運算：

```{.python}
>>> k.sum(axis=0)
array([12, 15, 11,  9])
>>> k.sum(axis=1)
array([20, 18,  9])
```

也就是：

```
axis = 0 時：             axis = 1 時：
[4    3    6    7 ]       [4 + 3 + 6 +   7 ] = 20
 +    +    +    +         [1 + 9 + 1 +   7 ] = 18
[1    9    1    7 ]       [7 + 3 + 4 + (-5)] =  9
 +    +    +    +         ==> [20 18 9]
[7    3    4  (-5)]
 =    =    =    =
[12   15   11   9 ]
```

# [Universal Functions][universal]
請原諒我沒有翻譯這個名詞，這個詞太難了。官方給的定義是 — 「 Universal function （下稱 ufunc ）是個作用在 `numpy.ndarray`{.python} 時會一個元素一個元素分開做運算、支援 [array broadcasting][broadcast] 、 [type casting][type-casting] 與其他林林總總標準特色的函式。是一個接受固定數量特定輸入後產出固定數量特定輸出的函數的[『向量化』][vectorized]包裝」。

講白一點就是本文所稱的「元素導向」的函式。  
屬於 ufunc 的函式有 `numpy.sin`{.python} 、 `numpy.cos`{.python} 、 `numpy.exp`{.python} ... 等等，包含實作上面所提及的一元運算和算術運算子的函式。

```{.python}
>>> np.cos(np.array([0, 1, 2]))
array([ 1.        ,  0.54030231, -0.41614684])
```

可利用的 ufunc 列表在[這裡][ufunc]。


[universal]: https://numpy.org/doc/stable/reference/ufuncs.html
[broadcast]: https://numpy.org/doc/stable/reference/ufuncs.html#ufuncs-broadcasting
[type-casting]: https://numpy.org/doc/stable/reference/ufuncs.html#ufuncs-casting
[vectorized]: https://numpy.org/doc/stable/glossary.html#term-vectorization
[ufunc]: https://numpy.org/doc/stable/reference/ufuncs.html#available-ufuncs

# 索引（ indexing ）與切片（ slicing ）
一維陣列的索引與切片行為跟原生 Python 串列一模一樣：

```{.python}
>>> m = np.arange(5)
>>> m
array([0, 1, 2, 3, 4])
>>> m[3]  # 索引第四個元素
3
>>> m[1:3]  # 切出第 2 個到第 3 個元素
array([1, 2])
>>> m[::2]  # 切出位於雙數位置的元素
array([0, 2, 4])
>>> m[::-1]  # 元素倒轉排列
array([4, 3, 2, 1, 0])
```

高維度陣列的索引、切片語法是在中括號 [] 內將每個維度的動作用逗號「 , 」分隔開獨立處理：

```{.python}
>>> m2 = np.arange(25).reshape((5, 5))
>>> m2
array([[ 0,  1,  2,  3,  4],
       [ 5,  6,  7,  8,  9],
       [10, 11, 12, 13, 14],
       [15, 16, 17, 18, 19],
       [20, 21, 22, 23, 24]])
>>> m2[::2]  # 省略第二個軸的切片、索引，可以看到若省略則視同全選
array([[ 0,  1,  2,  3,  4],
       [10, 11, 12, 13, 14],
       [20, 21, 22, 23, 24]])
>>> m2[1:4, 1:3]  # 在第一個軸的方向選取第 2 到第 4 、在第二個軸選取第 2 到第 3 個元素
array([[ 6,  7],
       [11, 12],
       [16, 17]])
>>> m2[:, 1]  # 第一軸方向全選，第二軸方向只選第 2 個元素
array([ 1,  6, 11, 16, 21])
```

`numpy.ndarray`{.python} 也接受使用一個數列作為選取的方式：

```{.python}
>>> m2[[0,1,4], :3]
array([[ 0,  1,  2],
       [ 5,  6,  7],
       [20, 21, 22]])
```

上面的語法意思是「第一軸取第 1 、 2 、 5 個元素，第二軸取前 3 個元素」。   
`numpy.ndarray`{.python} 也接受用遮罩（ mask ）過濾的方式取值：

```{.python}
>>> mask = np.identity(5) == True
>>> mask
array([[ True, False, False, False, False],
       [False,  True, False, False, False],
       [False, False,  True, False, False],
       [False, False, False,  True, False],
       [False, False, False, False,  True]])
>>> m2
array([[ 0,  1,  2,  3,  4],
       [ 5,  6,  7,  8,  9],
       [10, 11, 12, 13, 14],
       [15, 16, 17, 18, 19],
       [20, 21, 22, 23, 24]])
>>> m2[mask]
array([ 0,  6, 12, 18, 24])
```

「`...`{.python}」 這個關鍵字在處理高維度陣列的時候帶來許多好處。  
假設 `x`{.python} 有五個軸：

- `x[1, 2, ...]    等同於 x[1, 2, :, :, :]`
- `x[..., 3]       等同於 x[:, :, :, :, 3]`
- `x[4, ..., 5, :] 等同於 x[4, :, :, 5, :]`


# 迭代 （ iteration ）
<!-- TODO: what is an iteration -->
單純的迭代過 `numpy.ndarray`{.python} 會迭代第一個軸：

```{.python}
>>> m3 = np.array([[0, 1, 2],
...                [3, 4, 5],
...                [6, 7, 8]])
>>> for i in m3:
...     print(i)
...
[0 1 2]
[3 4 5]
[6 7 8]
```

想迭代過所有的元素，請使用 [`numpy.ndarray.flat`{.python}][flat] ：

```{.python}
>>> for i in m3.flat:
...     print(i)
...
0
1
2
3
4
5
6
7
8
```

NumPy 也提供一個函式讓你迭代過所有元素的同時取得它的位置：

```{.python}
>>> for index, i in np.ndenumerate(m3):
...     print(index, i)
...
(0, 0) 0
(0, 1) 1
(0, 2) 2
(1, 0) 3
(1, 1) 4
(1, 2) 5
(2, 0) 6
(2, 1) 7
(2, 2) 8
```


[flat]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flat.html

# 重塑
介紹三種重塑的方法： [`numpy.ndarray.ravel`{.python}][ravel] 、 [`numpy.ndarray.reshape`{.python}][reshape] 、 [`numpy.ndarray.T`{.python}][T] 。  
以及疊放（ stacking ）的兩種方法： [`numpy.vstack`{.python}][vstack] 、[`numpy.hstack`{.python}][hstack] 。  
還有拆分（ splitting ）的兩種方法： [`numpy.vsplit`{.python}][vsplit] 、 [`numpy.hsplit`{.python}][hsplit] 。  

這一章節使用以下陣列做介紹：

```{.python}
>>> n = np.array([[1, 2,  3,  4],
...               [5, 6,  7,  8],
...               [9, 0, 11, 12]])
>>> n.shape
(3, 4)
```

陣列 n 為一個有兩個軸的陣列，第一軸方向的長度是 3 ，第二軸方向長度是 4 。

## [`numpy.ndarray.T`{.python}][T]
`numpy.ndarray`{.python} 的屬性之一，為該陣列的轉置（ transpose ）。  

```{.python}
>>> n.T
array([[ 1,  5,  9],
       [ 2,  6, 10],
       [ 3,  7, 11],
       [ 4,  8, 12]])
>>> n.T.shape
(4, 3)
```

<!-- TODO: 轉置是啥？ -->

相似作用的函式有： [`numpy.transpose`{.python}][transpose]

## [`numpy.ndarray.reshape`{.python}][reshape]
回傳指定形狀的陣列。  
用法：  `numpy.ndarray.reshape(shape)`{.python}   

```{.python}
>>> n.reshape((4, 3))
array([[ 1,  2,  3],
       [ 4,  5,  6],
       [ 7,  8,  9],
       [ 0, 11, 12]])
```

相似的方法（ method ）或函式還有 [`numpy.ndarray.resize`][resize] 、[`numpy.reshape`{.python}][reshape2] 、與 [`numpy.resize`][resize2] 。

## [`numpy.ndarray.ravel`{.python}][ravel]
回傳一個扁平化的陣列。

```{.python}
>>> n.ravel()
array([ 1,  2,  3,  4,  5,  6,  7,  8,  9,  0, 11, 12])
```

與 [`numpy.ndarray.flat`{.python}][flat] 的不同點是，flat 會回傳一個迭代器（ iterator ），而此方法會回傳一個陣列。  
與其相似的函式有 [`numpy.ravel`][ravel2] 。

## [`numpy.vstack`{.python}][vstack]
將多個等長的數列垂直疊放在一起。  
用法：  `numpy.vstack(tup)`{.python}  
注意要把所有數列合成一個大數列再放進去。

```{.python}
>>> o1 = np.array([[1, 2],
...                [3, 4]])
>>> o2 = np.array([[5, 6],
...                [7, 8]])
>>> np.vstack((o1, o2))
array([[1, 2],
       [3, 4],
       [5, 6],
       [7, 8]])
```

## [`numpy.hstack`{.python}][hstack]
將多個等長的數列水平疊放在一起。  
用法：  `numpy.hstack(tup)`{.python}  
注意要把所有數列合成一個大數列再放進去。

```{.python}
>>> np.hstack((o1, o2))
array([[1, 2, 5, 6],
       [3, 4, 7, 8]])
```

## [`numpy.hsplit`{.python}][hsplit]
沿著水平方向將陣列內元素平均分配成數個小組。  
用法: `numpy.hsplit(arry, indices_or_sections) -> list`{.python}   
arry 是即將被拆分的陣列、indices_or_sections 指定平均要拆分成幾組。回傳值是包含陣列的串列。

```{.python}
>>> p = np.arange(20).reshape((2, 10))
>>> p
array([[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9],
       [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]])
>>> np.hsplit(p, 2)
[array([[ 0,  1,  2,  3,  4],
       [10, 11, 12, 13, 14]]), array([[ 5,  6,  7,  8,  9],
       [15, 16, 17, 18, 19]])]
```


## [`numpy.vsplit`{.python}][vsplit]
沿著垂直方向將陣列內元素平均分配成數個小組。  
用法: `numpy.vsplit(arry, indices_or_sections) -> list`{.python}   
arry 是即將被拆分的陣列、indices_or_sections 指定平均要拆分成幾組。回傳值是包含陣列的串列。

```{.python}
>>> p.resize((4, 5))
>>> p
array([[ 0,  1,  2,  3,  4],
       [ 5,  6,  7,  8,  9],
       [10, 11, 12, 13, 14],
       [15, 16, 17, 18, 19]])
>>> np.vsplit(p, 4)
[array([[0, 1, 2, 3, 4]]), array([[5, 6, 7, 8, 9]]), array([[10, 11, 12, 13, 14]]), array([[15, 16, 17, 18, 19]])]
```


[ravel]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.ravel.html
[ravel2]: https://numpy.org/doc/stable/reference/generated/numpy.ravel.html
[reshape]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.reshape.html
[reshape2]: https://numpy.org/doc/stable/reference/generated/numpy.reshape.html
[T]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.T.html
[transpose]: https://numpy.org/doc/stable/reference/generated/numpy.transpose.html#numpy.transpose
[resize]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.resize.html
[resize2]: https://numpy.org/doc/stable/reference/generated/numpy.resize.html
[vstack]: https://numpy.org/doc/stable/reference/generated/numpy.vstack.html
[hstack]: https://numpy.org/doc/stable/reference/generated/numpy.hstack.html
[hsplit]: https://numpy.org/doc/stable/reference/generated/numpy.hsplit.html
[vsplit]: https://numpy.org/doc/stable/reference/generated/numpy.vsplit.html

# 「 View 」與複製
此章節講述 View 的概念與幾個複製陣列的方法。  

## 這樣做不會複製任何東西

```{.python}
>>> q = np.array([1, 3, 4, 2])
>>> q2 = q
>>> q2 is q
True
```

q2 和 q 對應到同一個儲存陣列的記憶體區塊，所以修改 q2 等同於修改 q ，反之亦然。

## View — 最淺層的複製
View 是一種衍生於原始陣列的新陣列。 View 沒有屬於自己的元素，它所展現的元素都是原始陣列的元素，所以說試圖修改 View 的元素值將會導致原始陣列的元素被改變。  

```{.python}
>>> q3 = q.view()   # q3 是 q 的 View
>>> type(q3)
<class 'numpy.ndarray'>
>>> q3 is q  # q3 並不是 q ，至少佔用的記憶體區段不一樣
False
>>> q3.base is q  # q3 是從 q 生出來的
True
>>> q3.flags.owndata  # q3 自己並不擁有資料
False
>>> q3.resize((2, 2))
>>> q3.shape
(2, 2)
>>> q.shape   # View 的形狀可以跟原始陣列不一樣
(4,)
>>> q3[1, 1] = 1234
>>> q
array([   1,    3,    4, 1234])  # 但是 View 的元素還是原始陣列的
````

## 更深一層複製
[`numpy.copy`{.python}][copy] 這個函式與 [`numpy.ndarray.copy`{.python}][arr-copy] 方法可以幫你進行更深一層複製。

```{.python}
>>> q4 = q.copy()
>>> q4 is q
False
>>> q4[0] = 9999
>>> q
array([   1,    3,    4, 1234])
```

我們可以看到 q4 不但不是 q ，而且改動 q4 也不會影響 q 了！  
複製這個動作有時候蠻有用的，例如我們只需要一個大陣列的其中一部份，我們可以把需要的部份切片下來，複製之後再把舊的大陣列刪除。

## 完全複製
上面提供的兩種複製方式在大部份情況下都可以高枕無憂，但是請看下面例子：

```{.python}
>>> a = np.array([1, 'm', [2, 3, 4]], dtype=object)
>>> b = a.copy()
>>> b
array([1, 'm', list([2, 3, 4])], dtype=object)
>>> b[2][0] = 10
>>> a
array([1, 'm', list([10, 3, 4])], dtype=object)
````

儘管使用了 `numpy.ndarray.copy`{.python} 進行複製，結果內容物還是被修改了。  
在這個情況下，我們可以看到原始陣列 a 裝著各式物件。Python 有個特性：表面上沒有指標（ pointer ）的概念，但水面下任何 Python 的可變（ mutable ）物件存取都是指標。舉例來說，在本章第一節「這樣做不會複製任何東西」的例子裡面， `q2 = q`{.python} 這個動作代表的意義是「將儲存在 q 上面，指向該陣列記憶體位置的值賦予給 q2 」。當我們每次呼叫 q2 或是 q ，Python 直譯器（ interpreter ）就會沿著指標的值查找實體記憶體，再將實體記憶體裡的串列值抓出來給你看。  

這邊把該例搬下來方便查看：

```{.python}
>>> q = np.array([1, 3, 4, 2])
>>> q2 = q
>>> q2 is q  # is 運算式會比較兩者的記憶體位置，若相同就回傳 True
True
```

了解可變物件存取都是指標的概念後我們再回頭看上方的例子。a 三個元素分別是 `int`{.python} 、 `str`{.python} 、 `list`{.python} ，整數及字串都是不可變物件，但是串列正是可變物件。也就是說 `a[2]`{.python} 的位置事實上存著的是串列 `[2, 3, 4]`{.python} 的記憶體位置（就是指標）。當我們把 a 的所有值都複製給 b 時，我們也只把指標複製給 b ，並沒有把串列 `[2, 3, 4]`{.python} 的值複製到另一個記憶體區塊，並把新的指標存進 `b[2]`{.python} 。  

於是 b 的第三個元素便還是存著跟 a 的第三個元素相同的記憶體位置參照，改動 `b[2]`{.python} 裡的元素當然會影響 `a[2]`{.python} 裡的元素。這樣的複製我們稱為「淺層複製」。

經過以上的討論，我們可以發現這件事情只有在「要複製的物件中存放著可變物件」這個情況會發生。我們再回過頭來看 NumPy 的應用場景，絕大部份都是數值運算，數值都是不可變物件，所以絕大部分我們都可以高枕無憂。

也許你會問：「這樣的情況無法避免嗎？」

其實還是可以的，上面建立陣列的章節也提到過，相對於淺層複製還有一個名詞叫「深層複製」。深層複製就是真正的從頭到尾、無論深度都建立一份新的物件，我們可以利用 `copy.deepcopy`{.python} 做到這件事。


[arr-copy]: https://numpy.org/doc/stable/reference/generated/numpy.ndarray.copy.html

# 小技巧
## 自動成型
當你在使用 `numpy.reshape`{.python} 的時候可以把其中一個參數交給 NumPy 決定：

```{.python}
>>> r = np.arange(24)
>>> r.reshape(2, -1, 4)  # -1 代表交給 NumPy 幫你算出這邊該分配幾個
array([[[ 0,  1,  2,  3],
        [ 4,  5,  6,  7],
        [ 8,  9, 10, 11]],

       [[12, 13, 14, 15],
        [16, 17, 18, 19],
        [20, 21, 22, 23]]])
```

## 運用兩個等長的一維陣列組成一個二維陣列
利用 `numpy.vstack`{.python} 可輕鬆做到：

```{.python}
>>> s1 = np.array([1, 2, 3])
>>> s2 = np.array([4, 5, 6])
>>> np.vstack((s1, s2))
array([[1, 2, 3],
       [4, 5, 6]])
```

# 最後
以上我們粗淺的體驗了 NumPy 提供的陣列的特性與基本操作，希望能讓大家踏入 NumPy 的第一步更加順暢。本文到這裡結束，祝各位有個更好的明天。  

我們有緣，再見。


# 你可能還想看...
- 官方使用者手冊
  - [Official Guide for absolutely beginer][beginner] — 從安裝到畫圖，任何全新手需要的都在這裡
  - [Official Guide][user-guide] — 基本上我是抄這邊的
  - [NumPy Fundamentals][fundamentals] — 另外一份更詳盡的官方說明書
- [NumPy API references][API]
- 索引與切片
  - [indexing API reference][index-API]
  - [indexing user guide][index-guide]
- [Literally, WHAT IS array_like?][array_like2] — StackOverflow 上的討論串，藉由研究底層 C 原始碼發現：基本上任何東西都是類陣列物件
- [list of ufunc][ufunc] — 完整的 ufunc 清單
- [Tutorial: Linear algebra on n-dimensional arrays][tutorial] — NumPy 官方以處理照片為例子示範 NumPy 的線性代數應用。
- [你可以在這裡找到標題的圖片][logo-source]


[tutorial]:https://numpy.org/doc/stable/user/tutorial-svd.html
[fundamentals]:https://numpy.org/doc/stable/user/basics.html
[user-guide]:https://numpy.org/doc/stable/user/index.html
[ufunc]:https://numpy.org/doc/stable/reference/ufuncs.html#available-ufuncs
[index-guide]:https://numpy.org/doc/stable/user/basics.indexing.html#combining-index-arrays-with-slices
[index-API]:https://numpy.org/doc/stable/reference/arrays.indexing.html#arrays-indexing
[API]:https://numpy.org/doc/stable/reference/index.html
[beginner]:https://numpy.org/doc/stable/user/absolute_beginners.html
[array_like2]:https://stackoverflow.com/questions/40378427/numpy-formal-definition-of-array-like-objects
[logo-source]: https://commons.wikimedia.org/wiki/File:NumPy_logo_2020.svg
