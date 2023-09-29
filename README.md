# ankiEng

## Todo List

You have to past those snippets of code for your card formats.

## - Card Type 1 -

### - Front -

```
<span class="field_header">Example Sentence</span>
<p id="revealing_text">{{example_en}}</p>

<span class="field_header">Translation</span>
<div id="answer">{{type:translation}}</div>

<link rel="stylesheet" href="ankiEng/note/style.css"/>
<script src="ankiEng/note/common.js"></script>
<script src="ankiEng/note/front.js"></script>
```

### - Back -

```
<span class="field_header">Example Sentence</span>
<p id="revealing_text">{{example_en}}</p>

<span class="field_header">Translation</span><br/>
{{type:translation}}

<p id="example_fr">{{example_fr}}</p>
{{img}}

<link rel="stylesheet" href="ankiEng/note/style.css"/>
<script src="ankiEng/note/back.js"/>
```
