$ErrorActionPreference = "Stop"

$outDir = Join-Path (Get-Location) "competition-materials"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$wordPath = [System.IO.Path]::GetFullPath((Join-Path $outDir "创业计划书-劲酒智慧配送与对账系统-完整版.docx"))
$pptxPath = [System.IO.Path]::GetFullPath((Join-Path $outDir "路演汇报PPT-劲酒智慧配送与对账系统-完整版.pptx"))
$pdfPath = [System.IO.Path]::GetFullPath((Join-Path $outDir "路演汇报PPT-劲酒智慧配送与对账系统-完整版.pdf"))

function AddLine($selection, $text) {
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function AddTitle($selection, $text) {
    $selection.Font.Bold = 1
    $selection.Font.Size = 18
    AddLine $selection $text
    $selection.Font.Bold = 0
    $selection.Font.Size = 12
}

function AddH1($selection, $text) {
    $selection.Font.Bold = 1
    $selection.Font.Size = 14
    AddLine $selection $text
    $selection.Font.Bold = 0
    $selection.Font.Size = 12
}

function AddH2($selection, $text) {
    $selection.Font.Bold = 1
    $selection.Font.Size = 12
    AddLine $selection $text
    $selection.Font.Bold = 0
}

function AddTable($doc, $selection, $rows, $cols, $data) {
    $range = $selection.Range
    $table = $doc.Tables.Add($range, $rows, $cols)
    $table.Borders.Enable = 1
    for ($r = 1; $r -le $rows; $r++) {
        for ($c = 1; $c -le $cols; $c++) {
            $table.Cell($r, $c).Range.Text = $data[$r - 1][$c - 1]
        }
    }
    $selection.SetRange($table.Range.End, $table.Range.End)
    $selection.TypeParagraph()
}

# ---------------- Word ----------------
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$sel = $word.Selection

AddTitle $sel "创业计划书"
AddLine $sel "项目名称：劲酒智慧配送与对账系统"
AddLine $sel "项目定位：酒水经销数字化运营平台"
AddLine $sel "参赛类别：创新创业大赛"
AddLine $sel "版本：V2.0（完整版）"
AddLine $sel "日期：2026年4月"
AddLine $sel ""

AddH1 $sel "目录"
$tocItems = @(
    "一、企业概况",
    "二、创业团队情况",
    "三、市场评估",
    "四、市场营销计划",
    "五、企业组织结构",
    "六、项目投资与设备投入",
    "七、流动资金与经营费用（月）",
    "八、销售收入预测",
    "九、销售与成本计划",
    "十、现金流量计划",
    "十一、实施计划与阶段目标",
    "十二、风险分析与应对"
)
foreach ($i in $tocItems) { AddLine $sel $i }
AddLine $sel ""

AddH1 $sel "一、企业概况"
AddH2 $sel "1.1 项目缘起"
AddLine $sel "传统酒水配送场景中，商家资料、配送状态、应收账款和回款记录通常分散在纸质台账和聊天工具中，导致效率低、对账慢、责任追溯困难。"
AddLine $sel "本项目以“业务闭环+轻量部署”为核心，面向中小经销团队提供可快速落地的数字化系统。"
AddH2 $sel "1.2 企业愿景"
AddLine $sel "成为区域酒水经销行业最具实用价值的数字化运营底座，帮助客户实现流程标准化、数据在线化和经营可视化。"
AddH2 $sel "1.3 主要经营范围"
AddLine $sel "软件产品订阅、系统实施服务、运维服务、经营分析增值服务。"

AddH1 $sel "二、创业团队情况"
AddLine $sel "团队构成：产品负责人、技术负责人、实施运营负责人。"
AddLine $sel "核心能力：前后端开发、业务流程梳理、客户实施交付。"
AddLine $sel "已完成：系统原型上线，核心业务闭环可运行，沉淀商家数据约1915条。"

AddH1 $sel "三、市场评估"
AddH2 $sel "3.1 目标客户描述"
AddLine $sel "目标客户为区域中小酒水经销商、配送站点、业务团队管理者，普遍具备数字化升级意愿但预算有限。"
AddH2 $sel "3.2 市场容量与趋势"
AddLine $sel "快消品经销链路对“及时配送+快速回款”的要求持续增强，管理系统向移动化和场景化发展。"
AddH2 $sel "3.3 竞争分析"
AddLine $sel "通用ERP功能复杂、成本较高；本项目聚焦配送与对账刚需，实施周期短、学习成本低。"

AddH1 $sel "四、市场营销计划"
AddH2 $sel "4.1 产品/服务结构"
$productTable = @(
    @("产品/服务", "主要特征", "目标客户"),
    @("基础版系统", "商家管理、配送台账、欠款管理", "单团队经销商"),
    @("专业版系统", "新增报表分析、权限管理", "多角色团队"),
    @("企业版系统", "私有化部署、接口扩展", "规模化企业"),
    @("实施服务", "上线部署、数据初始化、培训", "全部客户"),
    @("增值服务", "经营诊断、流程优化、数据分析", "成长型客户")
)
AddTable $doc $sel 6 3 $productTable

AddH2 $sel "4.2 定价策略（示例）"
$priceTable = @(
    @("项目", "预测成本", "建议售价", "竞品区间"),
    @("基础版（年）", "3000元", "9800元", "8000-12000元"),
    @("专业版（年）", "5000元", "16800元", "15000-25000元"),
    @("企业版（年）", "9000元", "29800元", "25000元以上"),
    @("实施服务", "按人天核算", "5000-20000元", "同类相当")
)
AddTable $doc $sel 5 4 $priceTable

AddH2 $sel "4.3 渠道与推广"
AddLine $sel "推广方式：样板客户试点、行业社群推广、渠道伙伴合作、转介绍机制。"
AddLine $sel "销售方式：直销为主，渠道合作为辅。"

AddH1 $sel "五、企业组织结构"
$orgTable = @(
    @("岗位", "职责", "人数", "月薪（元）"),
    @("项目负责人", "战略、商务、关键决策", "1", "8000"),
    @("技术开发", "功能开发、系统维护", "2", "7000"),
    @("产品实施", "客户上线、培训、运营", "2", "6000"),
    @("合计", "-", "5", "34000")
)
AddTable $doc $sel 5 4 $orgTable
AddLine $sel "企业形态：拟采用有限责任公司，建立标准化交付和服务流程。"

AddH1 $sel "六、项目投资与设备投入"
$investTable = @(
    @("项目", "金额（元）", "说明"),
    @("研发设备与工具", "25000", "开发电脑、测试设备、工具授权"),
    @("服务器与云资源", "18000", "应用部署、备份与监控"),
    @("实施与培训材料", "10000", "培训手册、客户上线支持"),
    @("市场启动费用", "27000", "试点推广、品牌物料"),
    @("合计", "80000", "-")
)
AddTable $doc $sel 6 3 $investTable

AddH1 $sel "七、流动资金与经营费用（月）"
$monthlyCost = @(
    @("费用项目", "金额（元）"),
    @("人员工资", "34000"),
    @("办公与场地", "4500"),
    @("云资源与网络", "1800"),
    @("差旅与客户服务", "2500"),
    @("营销推广", "3500"),
    @("其他费用", "1700"),
    @("合计", "48000")
)
AddTable $doc $sel 8 2 $monthlyCost

AddH1 $sel "八、销售收入预测（12个月）"
$incomeTable = @(
    @("季度", "基础版客户数", "专业版客户数", "企业版客户数", "季度收入（元）"),
    @("Q1", "8", "3", "1", "156800"),
    @("Q2", "15", "6", "2", "315400"),
    @("Q3", "24", "10", "3", "496200"),
    @("Q4", "35", "14", "5", "754600"),
    @("全年", "82", "33", "11", "1723000")
)
AddTable $doc $sel 6 5 $incomeTable

AddH1 $sel "九、销售与成本计划"
$profitTable = @(
    @("项目", "年度金额（元）"),
    @("销售收入", "1723000"),
    @("直接成本", "420000"),
    @("运营成本", "576000"),
    @("营销费用", "180000"),
    @("税费与其他", "120000"),
    @("预计净利润", "427000")
)
AddTable $doc $sel 7 2 $profitTable

AddH1 $sel "十、现金流量计划"
AddLine $sel "预计第1-2个月为投入期，第3个月开始现金流趋稳，第6个月后进入正向滚动。"
$cashTable = @(
    @("阶段", "现金流入（元）", "现金流出（元）", "净现金流（元）"),
    @("1-3月", "180000", "265000", "-85000"),
    @("4-6月", "320000", "290000", "30000"),
    @("7-9月", "510000", "340000", "170000"),
    @("10-12月", "713000", "381000", "332000"),
    @("全年", "1723000", "1276000", "447000")
)
AddTable $doc $sel 6 4 $cashTable

AddH1 $sel "十一、实施计划与阶段目标"
AddLine $sel "短期（0-6个月）：完成标准化部署包，落地10家种子客户。"
AddLine $sel "中期（6-18个月）：拓展多仓协同与经营分析，累计服务50家客户。"
AddLine $sel "长期（18个月以上）：形成区域品牌影响力，构建行业生态合作。"

AddH1 $sel "十二、风险分析与应对"
AddLine $sel "风险1：客户数字化基础薄弱。应对：提供培训+陪跑上线。"
AddLine $sel "风险2：需求差异导致交付复杂。应对：模块化产品边界管理。"
AddLine $sel "风险3：市场竞争加剧。应对：强化场景深耕与服务口碑。"
AddLine $sel ""
AddLine $sel "结论：项目具备真实场景基础和可复制商业路径，具备较强参赛可行性与落地价值。"

$doc.SaveAs([string]$wordPath, 16)
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null

# ---------------- PPT ----------------
$pp = New-Object -ComObject PowerPoint.Application
$pres = $pp.Presentations.Add()

function AddSlideText($presentation, $title, $lines) {
    $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, 2)
    $slide.Shapes.Title.TextFrame.TextRange.Text = $title
    $slide.Shapes.Item(2).TextFrame.TextRange.Text = ($lines -join "`r`n")
}

AddSlideText $pres "劲酒智慧配送与对账系统" @(
    "创新创业大赛路演汇报",
    "让经销配送管理更高效，让账款流转更透明",
    "团队：产品/研发/运营一体化"
)
AddSlideText $pres "01 项目背景" @(
    "配送、对账、回款流程碎片化，人工管理成本高",
    "信息分散导致数据延迟、错漏、责任难追溯",
    "中小经销商急需低成本数字化工具"
)
AddSlideText $pres "02 痛点分析" @(
    "流程痛点：多渠道记录，无法形成统一台账",
    "管理痛点：配送状态与应收账款不同步",
    "经营痛点：缺少复盘数据，决策依赖经验"
)
AddSlideText $pres "03 解决方案" @(
    "构建配送与对账一体化系统，打通业务闭环",
    "覆盖：商家建档 -> 配送执行 -> 欠款追踪 -> 收款核销",
    "支持移动端随时操作，适配一线场景"
)
AddSlideText $pres "04 核心功能" @(
    "商家与片区管理",
    "未送达/已送达清单",
    "欠款列表与收款登记",
    "综合查询与历史快照"
)
AddSlideText $pres "05 技术架构" @(
    "前端：HTML + JavaScript + PWA",
    "后端：Node.js + Express",
    "数据层：轻量数据库",
    "部署方式：本地/私有化快速部署"
)
AddSlideText $pres "06 阶段成果" @(
    "系统原型已可稳定运行",
    "商家数据沉淀约1915条",
    "具备样板客户试点条件"
)
AddSlideText $pres "07 市场分析" @(
    "目标用户：区域中小酒水经销商",
    "需求关键词：便捷、低门槛、见效快",
    "市场机会：垂直场景数字化渗透率仍低"
)
AddSlideText $pres "08 商业模式" @(
    "订阅收费：基础版/专业版/企业版",
    "服务收费：实施、培训、运维",
    "增值收费：数据分析与定制模块"
)
AddSlideText $pres "09 竞争优势" @(
    "场景深耕：聚焦配送+对账刚需",
    "实施效率：部署轻、上手快",
    "产品路线：标准化+可扩展并行"
)
AddSlideText $pres "10 团队与规划" @(
    "团队能力覆盖产品、技术、运营",
    "0-6个月：10家种子客户",
    "6-18个月：50家客户，形成区域复制"
)
AddSlideText $pres "11 融资需求" @(
    "计划融资：20万元",
    "资金用途：产品迭代、市场拓展、交付体系",
    "目标：12个月内形成稳定付费结构"
)
AddSlideText $pres "12 感谢评委" @(
    "劲酒智慧配送与对账系统",
    "以数字化能力驱动经销效率升级",
    "期待交流与合作"
)

$pres.SaveAs([string]$pptxPath)
$pres.SaveAs([string]$pdfPath, 32)
$pres.Close()
$pp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pres) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null

Write-Output $wordPath
Write-Output $pptxPath
Write-Output $pdfPath
