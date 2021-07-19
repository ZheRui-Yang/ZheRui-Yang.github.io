---
title: 猴子也能懂的 AWS Rekognition 雲端人臉辨識
---

---

# 目標


在本地端（你的電腦）請亞馬遜幫你照片上人像的情緒及外觀特徵。

這裡使用的是終端機環境。雖然不太親民、也不好看，不過最大的好處是未來需要自動化、程式化的場合時會比較方便。

![左半邊是官網上複製下來的程式碼，右半邊是照片的分析結果](./media/goal.png)

是的，這份文件的目標就是這麼小。


---

# 手把手帶你走


## 一、創建帳號
亞馬遜帳號的結構並不像臉書、IG 等等的帳號，一個帳號就是代表一個人。
它更接近早期大型伺服器的概念：一個擁有無上權限的根帳號（ root ），以及底下被根帳號賦予不同程度權限的 IAM 使用者們。

這樣的結構在早年「伺服器—終端機」架構為主流時相當盛行，後來個人電腦興起後式微。
不過事實上每台電腦也都留有這個結構的影子——這也就是為什麼有時候你會需要按下右鍵，
選擇「以管理者權限執行」（ 或是「 sudo 」）。

### 創建根帳號
雖說是開發者帳號，其實也只是亞馬遜服務的使用者。（略）

### 創建 IAM 使用者管理者

[亞馬遜說明頁面](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)  

說明頁面第一部份是利用網頁主控台創建新使用者，也就是我們會使用的方式。第二部份利用指令列工具創建使用者這裡略過不提。

<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">為什麼需要創建 IAM 使用者？</summary>
簡而言之：安全性、以及資源管理。  

- 安全性   
  若是平常使用的是根帳號（擁有無限大的權限，包含刪除自己），哪天資安出問題我們就只好祈禱駭客沒有惡搞受害專案的習性。  
- 資源管理   
  也許根帳號是公司的，你不會想看到坐你旁邊，負責撰寫人臉辨識的小明拿公司資源做論壇輿情分析找出最受好評的番號。

若以上兩點還不能說服你，那至少亞馬遜官方希望你要有。

當然，IAM 使用者也需要一個管理者。這位管理者也就是我們現在要建立的 IAM 使用者管理者。

</details>

#### 建立
點進上面的說明頁面，往下拉會看到「 Creating an administrator IAM user and user group (console) 」
這個標籤下方有「 Sign in to the IAM console 」的超連結。

![Sign in to the IAM console](./media/iamconsole.png)

選擇以根帳號登入

![記得是要選 root ，因為我們還沒有 IAM 使用者](./media/rootlogin.png)

說明頁面第二步是講讓 IAM 使用者管理者也能接帳單的功能，「 IAM User and Role Access to Billing Information 」在頁面的下方要往下拉一下。

左邊導覽列選 「 Users 」

![Users 在這裡](./media/user.png)

選 「Add user 」

![藍色大大的按鈕](./media/adduser.png)

（圖片上存在的 IAM 使用者是我已經創建好的，新的帳號不會有）

輸入名字，官方建議是使用 Administrator ，比較不會忘記誰是誰。
紅圈處若是 IAM 使用者管理者我們請務必勾選，不能進主控台的管理者跟沒有醬汁的炸蝦一樣沒有存在的必要。

![下方是新使用者的密碼選項，依照自己喜好選擇即可](./media/username.png)

#### 設定權限
上面設定完名字之後會進入使用者權限設定。由於管理者很有可能不只一位，官方建議直接開一個權限群組來讓新生的使用者管理者加入。
當然也可以直接把權限加到使用者身上。

這裡我們會開一個管理者群組加入後，再把我們的目標 —— AWS Rekognition 服務所需的權限一個個直接放到我們的新身份身上。

（註：讓使用者管理者還有其他的權限可能並不是最漂亮的作法）

##### 建立權限群組並加入
按「 Create Group 」

![藍色框框的地方要注意；新帳號底下應該是沒有任何群組的](./media/creategroup.png)

搜尋「AdministratorAccess 」並勾選後面沒有接其他字的那個。

![在第一個的話不用搜也沒關係](./media/groupauthselect.png)

確認建立後回來系統會自動幫你勾選剛建立的新權限群組，按下下一步就好。

![不過還是瞄一眼確認一下](./media/confirmjoingroup.png)

接下來是幫新生使用者打標籤（以辨識職責權限，不強制）—> 二次確認 —> 確認創建使用者

完成後會看到這個畫面

![紅圈那個可以選擇下載下來，不過裡面目前只有登入連結與名稱（或剛設定的密碼）](./media/finish.png)

##### 對使用者添加權限
接下來我們要將 AWS Rekognition 所需的兩樣權限直接加到新使用者身上。 
這時候我們還是根帳號，還沒登入新使用者。

上方搜尋欄旁的 Services 下拉選單左側應該會有個 IAM ，點選進入。
若沒看到，直接搜尋也可

![直接搜尋長這樣](./media/searchiam.png)

在 IAM 管理頁面上選擇 Users ，也就是我們建立新使用者的地方。接著點選熱騰騰的新使用者
，來到這個畫面點「 add permissions 」

![藍色大大的按鈕](./media/addpermision.png)

選「 Attach existing polices directly 」，下面直接搜尋

-  **AmazonRekognitionFullAccess**
-  **AmazonS3ReadOnlyAccess**

這兩項權限並勾選起來。

![總共有 667 項不同的權限，我們不要一個一個逛好不好...](./media/addpermission2.png)

勾選完右下角藍色「 Review 」確認後「 Add permissions 」就完成了。

## 二、建立亞馬遜指令列環境與標準開發者套件

[說明頁面](https://docs.aws.amazon.com/rekognition/latest/dg/setup-awscli-sdk.html)  

說明頁面給了指令列環境的安裝說明超連結以及安裝後的設定。安裝後的設定是指「在指令列（本機）使用剛剛創建好的使用者身份」以及指定使用哪個伺服器。

<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">指令列環境與標準開發者套件是什麼？</summary>

- 指令列環境（ command line interface, CLI ）  
  是指利用文字與電腦溝通的人—機介面。例如：Microdoft Windows 的 cmd 、powershell；MacOS 的 Termianl.app。  
  總之是一些黑黑的、上面字密密麻麻的，會用的人都長的很像駭客的東西。  
  噢！對了！ Spyder 裡的 IPython shell （右下角那個）也是這個東東。  

- 標準開發套件（ standard developer kit, SDK ）
  是軟體服務提供者方便下游軟體開發者加速開發的一組工具。  

</details>

### 下載及安裝
說明頁面的這裡是下載及安裝超連結

![](./media/clidownloadhref.png)

選擇 Version 2

![老實說我也不知道 v1 跟 v2 差在哪，不過我不在意](./media/v2.png)

按下去會進入介紹版本的頁面，我們不須停留

![這裡有較詳盡的版本介紹](./media/installcli.png)

照著你的電腦選擇作業系統。  

#### Windows
安裝檔是一個 .msi 檔。沒記錯的話點兩下啟動後用下一步大法就沒問題了。

![安裝檔下載連結](./media/win.png)

安裝程式結束後，在開始選單內搜尋「 cmd 」，開啟後輸入

```bash
aws --version
```

若有跳出類似以下的文字的話就代表這部份成功。

```bash
aws-cli/2.1.29 Python/3.7.4 Windows/10 botocore/2.0.0
```

解除安裝說明也在同一頁面上，可以參考。

#### MacOS
MacOS 的安裝方式有兩種：一種是圖形介面、一種是用命令列安裝。會用命令列安裝的人應該不需要這份文件的指引。

安裝檔是一個 .pkg 檔。沒猜錯的話點兩下啟動後照著說明走就沒問題了。

![安裝檔下載連結](./media/mac.png)

##### 安裝給所有使用者
若想安裝給全部的使用者，需要用到 `sudo`{.bash} 指令提取管理員權限。

- 基本上可以安裝在任意目錄底下，但是建議 `/usr/local/aws-cli`{.bash} 。
- 安裝程式會自動在 `/usr/local/bin/aws`{.bash} 建立一個軟連結讓所有使用者取用。

##### 只安裝給現在使用者
若只想安裝給正在使用的使用者雖不須用 `sudo`{.bash} 提昇權限，但安裝完成後須手動放置一個軟連結到系統路徑底下的任一目錄裡。

<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">怎麼知道系統路徑在哪裡？  </summary>
  打開 Termianl.app 輸入 `echo $PATH`{.bash} ，出現的文字就是在描述系統路徑包含的目錄

</details>
<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">若系統路徑沒有任何一個目錄我有權限寫入怎麼辦？  </summary>
  用 `sudo`{.bash} 提昇權限或聯絡你的系統管理員  

</details>
<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">啊要怎麼打軟連結？  </summary>
  ```bash
  sudo ln -s /FOLDER/INSTALLED/aws-cli/aws /usr/local/bin/aws
  sudo ln -s /FOLDER/INSTALLED/aws-cli/aws_completer /usr/local/bin/aws_completer 
  ```
  以上兩行程式碼複製貼到 Terminal.app 裡按下 Enter，大寫字體部份替換成你安裝的目錄。若路經包含空白記得用單引號包起來（例如： `/'space splited path'/`{.bash}）。  
  尾端跟隨的目錄是軟連結檔案放置的位置，可以更換成其他系統路徑（最後面 `/aws`{.bash} 跟 `/aws_completer`{.bash} 不要改）。雖然可以更換，不過 `/usr/local/bin`{.bash} 是執行檔集中處，放在一起比較好管理。  
  另外若是有寫入權限的話，最前面的 `sudo`{.bash} 是可以省略的。  

</details>

安裝程式結束後，開啟 Terminal.app 一次一行輸入以下指令
```bash
which aws
aws --version
```
第一個指令的回覆會是軟連結的位置，長的差不多這樣「`/usr/local/bin/aws`{.bash}」  
並且第二個指令的輸出若類似以下的文字的話就代表這部份成功。

```bash
aws-cli/2.1.29 Python/3.7.4 Windows/10 botocore/2.0.0
```

解除安裝說明也在同一頁面上，可以參考。

<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">Linux 與 Docker</summary>
你認真？這份文件不是為會用這兩者之一的你準備的。

</details>

### 設定本地端 AWS CLI 身份與地區

#### 取得身份代碼與密鑰
本地端安裝完，我們再回到 IAM 主控台、由左側導覽區進入 Users 頁面，選擇剛剛建立好的新使用者。
選擇「安全認證」頁籤

![Security credentails](./media/sc.png)

按下按鈕產生密鑰

![Create access key](./media/key.png)

產生出來的畫面如下。這兩個資訊相當敏感，請妥善保存。

![建議這裡可以存下來](./media/akey.png)

未來若是忘記身份代碼與密鑰，可以回到「安全認證」這個頁籤來查詢。

#### 地區的選擇
雖然選擇靠近自己地理位置越近的伺服器連線延遲就越少，但是某些服務在某些伺服器上面並不提供。例如我本來是選擇日本讚岐的伺服器，不過那邊並不提供這次目標的服務。我們選擇美東一號伺服器 **us-east-1** 。

#### AWS CLI 基本設定
打開你的終端機（ cmd, Terminal.app, ...etc ）輸入以下指令
```bash
aws configure
```
程式會依序問我們四個問題：身份代碼、密鑰、預設區域，與輸出格式。   
前三者剛才都準備好了。輸出格式就寫 `json`{.bash} 就行了， [JSON][jsonformat] 是個好格式。

完成後 AWS CLI 會在當前使用者家目錄底下建立一個 `.aws`{.bash} 目錄，並在裡面產生 `credentials`{.bash} 及 `config`{.bash} 文字檔。未來需要改動設定時除了 `aws config`{.bash} 指令外，編輯這兩個檔案也有同樣的效果。


[jsonformat]: https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Objects/JSON



<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">什麼是家目錄？</summary>
使用者的頂層目錄，初始設計的時候預設家目錄以上的目錄都沒有寫入權限（不能存檔的意思）；以下的目錄則相反。  
許多軟體都會預設把東西丟在家目錄。

- Windows：位於 `C:\\Users\USERNAME`{.bash}   
  在`cmd`{.bash} 中使用 `echo %USERPROFILE%`{.bash} 做確認；在 `File Explorer`{.bash} （平常翻看資料夾那個）中導覽列輸入 `%USERPROFILE%`{.bash} 直接跳過去。
- MacOS： 位於 `/Users/USERNAME`{.bash}  
  在 Terminal.app 中輸入 `echo $HOME`{.bash} 確認。打開 Dophin （檔案瀏覽器）時路徑列最左邊應該是 HOME ，按下去就到了。

</details>

## 三、安裝 boto3 套件
[Boto3 Documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html)   

`boto`{.bash} 套件是亞馬遜雲端服務在 Python 的 API ，安裝它才能輕鬆用 Python 接介亞馬遜雲端服務。

<details>
<summary onmouseover="this.style='background-color:#deeefc'"
	 onmouseout="this.style='background-color:none'">什麼是 API ？</summary>
應用程式介面（ Application Programming Interface, API ）。  

算是蠻抽象的概念，泛指任何應用程式與另一個應用程式互動的介面。  
以硬體舉例來說：桌上型電腦（程式 A ）的鍵盤（程式 B ）可能需要透過 USB 、PCI ，或是藍芽連接上電腦。這時我們稱他們連接的方式為 API 。

</details>

### Anaconda
若有分割虛擬環境就進入虛擬環境。   
```bash
conda install -c anaconda boto
```

## 四、程式碼複製貼上
[參考頁面 — 本機圖片物件辨識](https://docs.aws.amazon.com/rekognition/latest/dg/images-bytes.html)   
[參考頁面 — 人臉偵測](https://docs.aws.amazon.com/rekognition/latest/dg/faces-detect-images.html)

將以下程式碼存成 .py 檔（ 或是貼到 Spyder ），在有 `boto3`{.bash} 套件的環境下執行。  
記得 `photo = 'photo'`{.python} 的字串 `'photo'`{.python} 改成你的圖片所在路徑。

```{#codeExample .python .numberLines}
#Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#PDX-License-Identifier: MIT-0 (For details, see https://github.com/awsdocs/amazon-rekognition-developer-guide/blob/master/LICENSE-SAMPLECODE.)

import json
import boto3

def detect_faces_local_file(photo):
    client = boto3.client('rekognition')
   
    with open(photo, 'rb') as image:
        response = client.detect_faces(Image={'Bytes': image.read()}, Attributes=['ALL'])

    for faceDetail in response['FaceDetails']:
        print('The detected face is between ' + str(faceDetail['AgeRange']['Low']) 
              + ' and ' + str(faceDetail['AgeRange']['High']) + ' years old')

        print('Here are the other attributes:')
        print(json.dumps(faceDetail, indent=4, sort_keys=True))

	# Access predictions for individual face details and print them
        print("Gender: " + str(faceDetail['Gender']))
        print("Smile: " + str(faceDetail['Smile']))
        print("Eyeglasses: " + str(faceDetail['Eyeglasses']))
        print("Emotions: " + str(faceDetail['Emotions'][0]))

    return len(response['FaceDetails'])

def main():
    photo = 'photo'

    label_count = detect_faces_local_file(photo)
    print("Labels detected: " + str(label_count))


if __name__ == "__main__":
    main()
```

由於 Python 是利用縮排來辨別程式區塊，我們先從縮排為 $0$ 的三個部份開始講解。

- 第 $4$、$5$ 行 — `import xxx`{.python}   
  模組、套件匯入。匯入這個動作就是跟 Python 直譯器說「把這份文件當作我寫在這裡」。模組和套件是別人寫好的工具組，將本來相當複雜的東西包裝成簡單的形式供人使用。這裡我們匯入的是 [`boto3`{.python}][boto3] 與 [`json`{.python}][json] 模組。`boto3`{.python} 不匯入就不能簡單使用 AWS ；`json`{.python} 在這裡的作用是讓輸出規則化。  

- 第 $7$ 與 $28$ 行 — `def detect_faces_local_file(photo):`{.python} 與 `def main():`{.python}   
  自定義[函式][func]。`main`{.python} 是主程式，把主程式定義成這個名字是 C++ 留下來的習慣，不強制。`detect_faces_local_file`{.python} 則是把所有包含 AWS 的操作都放在一起，並為未來其他區塊提供一個簡潔的介面。   
  函式之下的區塊會在被呼叫時執行。由於 Python 不使用括弧，而是使用縮排來定義每個區塊。造就相對於其他語言更一致且簡潔的文件風格，但相對的一個小小的、看不見的空白也能毀掉你的程式碼。

- 第 $35$ 行 — `if __name__ == "__main__":`{.python}   
  表示以下的區塊只有這份文件（ \_\_name\_\_ ）正是當前執行的 script （ \_\_main\_\_ ）時才會被執行。  
  這區塊的存在是在防止這份文件作為模組被其他文件匯入（ import ）時[發生意外狀況][1]。  
  由於這份文件其他的地方只有匯入陳述句與函式定義，直接執行時就只會執行 `main()`{.python} 這個函式。 

再來我們來看兩個函式的內容。

`main`{.python} 的內容只有三行，它首先把圖片[路徑][path]存入 `photo`{.python} 這個變數中，再來以 `photo`{.python} 為參數呼叫 `detect_faces_local_file`{.python} 這個函式，並把回傳值存入 `label_count`{.python} ，最後印出一行字。

最後才是重頭戲— `detect_faces_local_file`{.python} 函式

- 第 $8$ 行利用 [`boto3.client`{.python}][client] 這個方法將 [Amazon Rekognition 的 low-level client][rekclient] （ `Rekognition.Client`{.python} 類別）存入 `client`{.python} 變數

- 第 $10$ 行使用 [`with`{.python}][with] 陳述句將變數 `photo`{.python} 這個路徑記載的檔案利用 [`open`{.python}][open] 以「唯讀」、「以二進位字元讀入」的方式打開，並存成變數 `image`{.python}

- 第 $11$ 行呼叫 [`detect_faces`{.python}][detect] 方法並將結果存入 `response`{.python} 變數   

- 第 $13$ 行利用 [for 陳述句][for]迭代 `response`{.python} 名為 FaceDetails 的值。這行將該值底下的每一個東西依次存入變數 `faceDetail`{.python} 並執行底下的區塊。  
  這裡得提一下，`delete_faces`{.python} 方法的回傳值是個[字典][dict]。
- 第 $18$ 行利用 `json`{.python} 模組的 `dumps`{.python} 函式將 `faceDetail`{.python} 轉換成格式為 [JSON][jsonformat] 的字串，並打印出來。

- 第 $26$ 行出現 `return`{.python} 陳述句。回傳 `response`{.python} 裡鍵為 `FaceDetails`{.python} 的值的數量。
  執行 `return`{.python} 陳述句必定會結束函式，並同時令函式回傳接在 `return`{.python} 後面的運算結果。

以上就是這份文件所執行的內容。除去打印、匯入、函式定義，以及主程式區塊外，我們事實上只有做三件事：  

1. 建立 `Rekognition.Client`{.python} 物件 — 第 $8$ 行
1. 送出請求 — 第 $10$ 與第 $11$ 行
1. 處理回傳值 — 第 $13$ 與第 $18$ 行

未來若想利用 AWS 的 Face Analysis 服務，我們只需要解析回傳值的結構即可。輕鬆又愜意的人工智慧影像分析，AWS 挺你！


[1]: http://blog.castman.net/%E6%95%99%E5%AD%B8/2018/01/27/python-name-main.html
[boto3]: https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
[json]: https://docs.python.org/3/library/json.html
[path]: https://zh.wikipedia.org/zh-tw/%E8%B7%AF%E5%BE%84_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6)
[func]: https://shengyu7697.github.io/python-function/
[client]: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html#boto3.session.Session.client
[rekclient]: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/rekognition.html#client
[with]: https://www.geeksforgeeks.org/with-statement-in-python/
[open]: https://docs.python.org/3/library/functions.html#open
[detect]: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/rekognition.html#Rekognition.Client.delete_faces
[for]: https://docs.python.org/zh-tw/3/tutorial/controlflow.html#for-statements
[dict]: https://docs.python.org/zh-tw/3/tutorial/datastructures.html?highlight=%E5%AD%97%E5%85%B8#dictionaries


## 五、總結

身份、權限、伺服器地區、開發套件、程式碼，這五項是這個小練習的必備元素。 

我們需要一個 IAM 使用者的身份來讓 AWS 伺服器認識我們，從主控台取得身份代碼與密鑰來讓本地端的開發者套件能夠使用我們的 IAM 身份。

同時我們也需要給予該使用者 AmazonRekognitionFullAccess 與 AmazonS3ReadOnlyAccess 兩樣授權才足以利用這項雲端服務。  

接著注意某些伺服器並沒有提供某些服務，所以我們選擇 us-east-1 地區。 

最後在我們的 Python 開發環境下安裝 `boto3`{.python} 套件。  

以上條件湊齊後我們跟 AWS Rekognition 的線就接通了！用第四節的程式碼進行第一次雲端辨識吧！
