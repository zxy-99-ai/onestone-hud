import streamlit as st
import datetime

# --- 系统配置 (System Config) ---
st.set_page_config(page_title="OneStone Control Tower", layout="wide")
st.title("🛡️ OneStone 个人能效治理中心")

# --- 1. 资源状态 HUD (Resource HUD) ---
with st.sidebar:
    st.header("📊 实时资源监测")
    # 模拟从 Source Code 加载的逻辑阈值
    hp = st.slider("HP (物理续航 - 含宝宝副本)", 0, 100, 70)
    mp = st.slider("MP (逻辑带宽 - 核心资产)", 0, 100, 50)
    ap = st.slider("AP (表达力 - Stream C)", 0, 100, 20)
    
    st.divider()
    if hp < 40:
        st.error("⚠️ 系统预警：HP 过低，强制开启低功耗维护模式。")
    if mp > 80:
        st.success("🔥 状态极佳：建议开启 Stream A 深度架构任务。")

# --- 2. 核心治理逻辑 (Governance Core) ---
col1, col2 = st.columns([1.5, 1])

with col1:
    st.subheader("📜 动态任务日志 (Quest Log)")
    
    # 根据能耗分类的任务组
    with st.expander("🔴 本周大风暴 (The Storm - Strategic Anchor)", expanded=True):
        st.write("1. 完成 AI 治理引擎的逻辑闭环（Stream A）")
        st.progress(60)
        
    with st.expander("🟡 今日单点聚焦 (The Sniper - Single Focus)"):
        st.checkbox("重构 Klook 治理逻辑的英文叙事 (Stream C)")
        
    with st.expander("🔵 系统维护副本 (The Caretaker - Maintenance)"):
        st.write("👶 16个月宝宝日常看护 (HP 消耗源)")
        st.write("🧘 状态稳维：冥想 & 游泳 (回蓝/回血)")

with col2:
    st.subheader("🌳 技能树进化 (Skill Trees)")
    st.info("**Stream A: 系统治理**")
    st.caption("Lvl 2: AI 增强型治理（进行中）")
    st.progress(45)
    
    st.info("**Stream B: 战略 IP**")
    st.caption("Lvl 1: 简历玩家（已达成）")
    st.progress(100)
    
    st.warning("**Stream C: 业务表达**")
    st.caption("Lvl 1: 瓶颈突破训练（关键节点）")
    st.progress(25)

# --- 3. 认知减负开关 (Mental Offload Key) ---
st.divider()
st.subheader("🗝️ 认知减负决策 (Offloading Switch)")
decision_input = st.text_input("输入当前高能耗任务：", placeholder="例如：回复猎头的琐碎信息...")
if decision_input:
    st.write(f"💡 **能效建议：** 识别为低逻辑任务。建议交由 Gemini 自动草拟，不要占用你的 MP。")