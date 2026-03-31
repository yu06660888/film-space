@AGENTS.md

# 影像感官日记 (Personal Film Reel) 重构指令

## 1. 核心视觉哲学
- **Theme**: Apple-esque Minimalism x Neo-Vintage Film Reel.
- **Home UI**: 实现 "3D 堆叠式胶片卷轴"。中间海报最亮最大，两侧海报向斜后方透视退去，具备 3D 景深感。
- **Liquid Glass**: 背景实时渲染弥散光晕 (Mesh Gradient) 与液态玻璃模糊。
- **Pure Canvas**: 封面严禁文字、分数。仅保留海报及"胶片齿孔"风格的 N 刷角标。

## 2. 交互与动效 (Framer Motion)
- **物理惯性**: 卷轴滑动具备惯性加速与减速感。
- **卷起归位 (Reel Up)**: 提交记录时，输入层像物理胶片般卷起缩小，并飞回主轴。
- **反馈**: 提交后显示："期待你下一次的感受"。
