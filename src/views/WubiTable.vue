<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      86五笔字根表
    </h1>

    <!-- 查看模式切换 -->
    <div class="flex items-center gap-2 mb-8">
      <button
        v-for="mode in viewModes"
        :key="mode.value"
        class="px-4 py-2 rounded-full text-sm transition-colors"
        :class="activeMode === mode.value
          ? 'bg-primary text-white'
          : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
        @click="activeMode = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>

    <!-- 键盘布局视图 -->
    <div
      v-if="activeMode === 'keyboard'"
      class="card p-6 mb-8"
    >
      <h2 class="text-lg font-semibold text-text-primary mb-4">
        86五笔字根键盘分布图
      </h2>

      <div class="space-y-3 max-w-4xl">
        <!-- 第一行 一区（横） -->
        <div class="flex gap-2">
          <div
            v-for="key in keyboardRow1"
            :key="key.key"
            class="key-card"
            :class="{ 'key-card-active': selectedKey === key.key }"
            @click="selectKey(key.key)"
          >
            <span class="key-letter">{{ key.key }}</span>
            <span class="key-roots">{{ key.roots }}</span>
          </div>
          <span class="self-center text-sm text-text-tertiary ml-2">← 一区（横）</span>
        </div>

        <!-- 第二行 -->
        <div class="flex gap-2 pl-6">
          <div
            v-for="key in keyboardRow2"
            :key="key.key"
            class="key-card"
            :class="{ 'key-card-active': selectedKey === key.key }"
            @click="selectKey(key.key)"
          >
            <span class="key-letter">{{ key.key }}</span>
            <span class="key-roots">{{ key.roots }}</span>
          </div>
        </div>

        <!-- 第三行 二区（竖） -->
        <div class="flex gap-2 pl-12">
          <div
            v-for="key in keyboardRow3"
            :key="key.key"
            class="key-card"
            :class="{ 'key-card-active': selectedKey === key.key }"
            @click="selectKey(key.key)"
          >
            <span class="key-letter">{{ key.key }}</span>
            <span class="key-roots">{{ key.roots }}</span>
          </div>
          <span class="self-center text-sm text-text-tertiary ml-2">← 二区（竖）</span>
        </div>
      </div>

      <p class="text-sm text-text-tertiary mt-6">
        点击任意键位查看该键包含的所有字根
      </p>
    </div>

    <!-- 选中键位详情 -->
    <div
      v-if="selectedKey && selectedKeyInfo"
      class="card p-6 mb-8"
    >
      <h2 class="text-lg font-semibold text-text-primary mb-4">
        {{ selectedKey }} 键 - {{ selectedKeyInfo.name }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm text-text-tertiary mb-2">
            主根
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="root in selectedKeyInfo.mainRoots"
              :key="root"
              class="text-2xl px-3 py-1 bg-primary/10 text-primary rounded"
            >
              {{ root }}
            </span>
          </div>
        </div>

        <div v-if="selectedKeyInfo.subRoots && selectedKeyInfo.subRoots.length">
          <h3 class="text-sm text-text-tertiary mb-2">
            副根
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="root in selectedKeyInfo.subRoots"
              :key="root"
              class="text-2xl px-3 py-1 bg-bg-hover rounded"
            >
              {{ root }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="selectedKeyInfo.mnemonic"
        class="mt-4"
      >
        <h3 class="text-sm text-text-tertiary mb-2">
          口诀
        </h3>
        <p class="text-text-primary font-poetry">
          {{ selectedKeyInfo.mnemonic }}
        </p>
      </div>

      <div
        v-if="selectedKeyInfo.examples && selectedKeyInfo.examples.length"
        class="mt-4"
      >
        <h3 class="text-sm text-text-tertiary mb-2">
          示例字
        </h3>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="example in selectedKeyInfo.examples"
            :key="example.char"
            :to="`/hanzi/${example.char}`"
            class="px-3 py-1 bg-bg-hover rounded hover:bg-bg-active transition-colors"
          >
            {{ example.char }}
            <span class="text-xs text-text-tertiary font-mono ml-1">({{ example.code }})</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 字根口诀 -->
    <div
      v-if="activeMode === 'mnemonic'"
      class="card p-6"
    >
      <h2 class="text-lg font-semibold text-text-primary mb-4">
        86五笔字根口诀
      </h2>

      <div class="space-y-4 font-poetry text-lg leading-loose">
        <div
          v-for="(group, index) in mnemonicGroups"
          :key="index"
        >
          <h3 class="text-primary font-semibold mb-2">
            {{ group.name }}
          </h3>
          <p
            v-for="line in group.lines"
            :key="line"
            class="text-text-secondary"
          >
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeMode = ref('keyboard')
const selectedKey = ref('')

const viewModes = [
  { label: '按键位查看', value: 'keyboard' },
  { label: '字根口诀', value: 'mnemonic' }
]

const keyboardRow1 = [
  { key: 'Q', roots: '金勹犬甩儿' },
  { key: 'W', roots: '人八登头' },
  { key: 'E', roots: '月用乃豹脚' },
  { key: 'R', roots: '白手斤头' },
  { key: 'T', roots: '禾竹撇双人' },
  { key: 'Y', roots: '言文方点谁' },
  { key: 'U', roots: '立辛六门病' },
  { key: 'I', roots: '水旁兴头小' },
  { key: 'O', roots: '火业头四点' },
  { key: 'P', roots: '之字军盖建' }
]

const keyboardRow2 = [
  { key: 'A', roots: '工戈草头右' },
  { key: 'S', roots: '木丁西甫' },
  { key: 'D', roots: '大犬戊其古' },
  { key: 'F', roots: '土士二干十' },
  { key: 'G', roots: '王旁青头五' },
  { key: 'H', roots: '目上卜止虎' },
  { key: 'J', roots: '日早两竖与' },
  { key: 'K', roots: '口中两川字' },
  { key: 'L', roots: '田甲方框四' }
]

const keyboardRow3 = [
  { key: 'Z', roots: '纟幺绞丝底' },
  { key: 'X', roots: '幺弓匕母臂' },
  { key: 'C', roots: '又马巴无力' },
  { key: 'V', roots: '女刀九臼山' },
  { key: 'B', roots: '子了耳也框' },
  { key: 'N', roots: '已巳半丝心' },
  { key: 'M', roots: '山由贝几骨' }
]

const keyInfoMap = {
  'Q': {
    name: '金区',
    mainRoots: ['金', '勹', '犬'],
    subRoots: ['甩', '儿'],
    mnemonic: '金勹犬头甩儿边',
    examples: [
      { char: '金', code: 'QQQQ' },
      { char: '钱', code: 'QGT' }
    ]
  },
  'I': {
    name: '水区',
    mainRoots: ['水', '氵'],
    subRoots: ['小', '⺌'],
    mnemonic: '水旁兴头小倒立',
    examples: [
      { char: '汉', code: 'ICY' },
      { char: '江', code: 'IAG' },
      { char: '河', code: 'ISKG' },
      { char: '海', code: 'ITXU' }
    ]
  },
  'G': {
    name: '王区',
    mainRoots: ['王', '五', '一'],
    subRoots: ['青', '夫'],
    mnemonic: '王旁青头五夫一',
    examples: [
      { char: '王', code: 'GGGG' },
      { char: '国', code: 'LGYI' }
    ]
  }
}

const selectedKeyInfo = ref(null)

const selectKey = (key) => {
  selectedKey.value = key
  selectedKeyInfo.value = keyInfoMap[key] || {
    name: `${key}键`,
    mainRoots: [],
    subRoots: [],
    mnemonic: '',
    examples: []
  }
}

const mnemonicGroups = [
  {
    name: '一区（横起笔）',
    lines: [
      '11 G 王旁青头戋（兼）五一',
      '12 F 土士二干十寸雨',
      '13 D 大犬三羊古石厂',
      '14 S 木丁西',
      '15 A 工戈草头右框七'
    ]
  },
  {
    name: '二区（竖起笔）',
    lines: [
      '21 H 目具上止卜虎皮',
      '22 J 日早两竖与虫依',
      '23 K 口与川，字根稀',
      '24 L 田甲方框四车力',
      '25 M 山由贝，下框几'
    ]
  },
  {
    name: '三区（撇起笔）',
    lines: [
      '31 T 禾竹一撇双人立',
      '32 R 白手看头三二斤',
      '33 E 月彡（衫）乃用家衣底',
      '34 W 人和八，三四里',
      '35 Q 金勹缺点无尾鱼'
    ]
  },
  {
    name: '四区（捺起笔）',
    lines: [
      '41 Y 言文方广在四一',
      '42 U 立辛两点六门疒',
      '43 I 水旁兴头小倒立',
      '44 O 火业头，四点米',
      '45 P 之字军盖道建底'
    ]
  },
  {
    name: '五区（折起笔）',
    lines: [
      '51 N 已半巳满不出己',
      '52 B 子耳了也框向上',
      '53 V 女刀九臼山朝西',
      '54 C 又巴马，丢矢矣',
      '55 X 慈母无心弓和匕'
    ]
  }
]
</script>

<style scoped>
.key-card {
  flex: 1;
  background-color: var(--color-bg-hover);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;
}

.key-card:hover {
  background-color: var(--color-bg-active);
}

.key-card-active {
  background-color: rgba(44, 62, 80, 0.1);
  box-shadow: 0 0 0 2px var(--color-primary);
}

.key-letter {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.key-roots {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
