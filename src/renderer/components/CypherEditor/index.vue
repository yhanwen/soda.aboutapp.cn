<template>
<div class="cypher-editor-wrapper">
  <div class="text-input" ref="input"></div>
</div>
</template>

<script>

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/edit/closebrackets';
import 'cypher-codemirror/dist/cypher-codemirror-all.css';
import { createCypherEditor, parse } from 'cypher-codemirror';
import { neo4jSchema, codeMirrorSettings } from './common';
function triggerAutocompletion(cm, changed) {
  if (changed.text.length !== 1) {
    return;
  }

  const text = changed.text[0];
  const shouldTriggerAutocompletion =
    text === '.' ||
    text === ':' ||
    text === '[]' ||
    text === '()' ||
    text === '{}' ||
    text === '[' ||
    text === '(' ||
    text === '{' ||
    text === '$';
  if (shouldTriggerAutocompletion) {
    cm.execCommand('autocomplete');
  }
}
export default {
  props: {
    settings: {
      default() {
        return codeMirrorSettings;
      },
    },
    schema: {
      default() {
        return neo4jSchema;
      },
    },
    value: {
      default: '',
    },
    dbSchema: {
      default() {
        return {
          labels: [],
          relationshipTypes: [
          ],
          propertyKeys: [
          ],
        };
      },
    },
  },
  data() {
    return {
      input: null,
      editorSupport: null,
      editor: null,
    };
  },
  created() {
    // this.settings = props.settings || {};
    // this.schema = props.schema || {};
    // this.schema = props.schema || {};

    // if (props.theme) {
    //   this.theme = props.theme;
    //   this.settings.theme = props.theme;
    // }

    // this.input = null;
    // this.editorSupport = null;
    // this.editor = null;
  },
  mounted() {
    this.input = this.$refs.input;

    const { editor, editorSupport } = createCypherEditor(this.input, Object.assign({
    }, this.settings, {
      value: this.value,
    }));
    this.editor = editor;
    this.editor.on('change', triggerAutocompletion);
    this.editor.on('change', () => {
      this.$emit('change', this.editor.getValue());
    });
    this.editorSupport = editorSupport;
    this.editorSupport.on('updated', () => {
      console.log('UPDATED - this.editorSupport.version: ', this.editorSupport.version);
      console.table(this.editorSupport.queriesAndCommands.map(stmt => stmt.getText()));
    });
    this.editorSupport.on('update', () => {
      console.log('UPDATE - this.editor.version: ', this.editor.version);
      console.log('UPDATE - this.editorSupport.version: ', this.editorSupport.version);
      this.editorSupport
        .ensureVersion(this.editor.version)
        .then(() => {
          console.log('ENSURE OK - this.editor.version: ', this.editor.version);
          console.log('ENSURE OK - this.editorSupport.version: ', this.editorSupport.version);
        })
        .catch(() => {
          console.error('Version not found');
          console.log('ENSURE ERROR - this.editor.version: ', this.editor.version);
          console.log('ENSURE ERROR - this.editorSupport.version: ', this.editorSupport.version);
        });
    });
    this.editorSupport.setSchema(Object.assign({}, this.schema, this.dbSchema));
  },
  computed: {
  },
  watch: {
    dbSchema: {
      handler(newVal) {
        if (this.editorSupport && this.editorSupport.setSchema) {
          console.log(newVal);
          this.editorSupport.setSchema(Object.assign({}, this.schema, newVal));
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    parseContent() {
      const { referencesListener, referencesProviders } = parse(this.editor.getValue());
      const { queriesAndCommands } = referencesListener;
      console.log('queriesAndCommands: ', queriesAndCommands);
      console.log('referencesProviders: ', referencesProviders);
    },
  },
};
</script>

<style lang="less">
@import '../../assets/styles/vars.less';
@import '../../assets/styles/mixins.less';

.cypher-editor-wrapper {
  .CodeMirror{
    font-family: Inconsolata, Monaco, "Courier New", Terminal, monospace !important;
    font-size: 13px;
    height: 150px;
  }
  pre {
    font-family: Inconsolata, Monaco, "Courier New", Terminal, monospace !important;
  }
  .CodeMirror.cm-s-cypher.cm-s-cypher-dark{
    background: lighten(@gray-dark, 0);
    color: @white;
    .CodeMirror-gutters {
      background-color: lighten(@gray-dark, 0);
      border-right-color: lighten(@gray-dark, 0);
    }
  }
  .cm-s-cypher {
  }
}
</style>
