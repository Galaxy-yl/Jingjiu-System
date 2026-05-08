$ErrorActionPreference = "Stop"

$projectName = "Jinjiiu Smart Delivery and Reconciliation System"
$outputDir = Join-Path (Get-Location) "competition-materials"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$wordPath = Join-Path $outputDir "Project-Plan-Jinjiu-System.docx"
$pptxPath = Join-Path $outputDir "Pitch-Deck-Jinjiu-System.pptx"
$pdfPath = Join-Path $outputDir "Pitch-Deck-Jinjiu-System.pdf"

function Add-Heading($selection, $text) {
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-SubHeading($selection, $text) {
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

function Add-Body($selection, $text) {
    $selection.TypeText($text)
    $selection.TypeParagraph()
}

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Add()
$sel = $word.Selection

$sel.TypeText($projectName)
$sel.TypeParagraph()
$sel.TypeText("Business Plan for Innovation and Entrepreneurship Competition")
$sel.TypeParagraph()
$sel.TypeText("Version: V1.0")
$sel.TypeParagraph()
$sel.TypeText("Date: April 2026")
$sel.InsertBreak(7)

Add-Heading $sel "1. Executive Summary"
Add-Body $sel "This project digitizes delivery, reconciliation, and cash collection workflows for beverage distributors. It solves low efficiency and data fragmentation in traditional paper-based operations."
Add-Body $sel "The current system is already usable and supports merchant records, area management, delivery status tracking, receivable tracking, and daily business query pages on mobile browsers."

Add-Heading $sel "2. Pain Points and Opportunity"
Add-SubHeading $sel "2.1 Pain Points"
Add-Body $sel "Delivery, billing, and payment records are scattered across chat tools and paper notes."
Add-Body $sel "Manual summaries are slow and error-prone, causing delayed business decisions."
Add-Body $sel "Historical business data is difficult to retain and reuse across team changes."
Add-SubHeading $sel "2.2 Market Opportunity"
Add-Body $sel "Small and medium distributors need low-cost, easy-to-deploy digital tools with fast onboarding and clear ROI."

Add-Heading $sel "3. Product Solution"
Add-Body $sel "The solution uses a lightweight architecture: frontend pages + Node.js API + local lightweight database. It forms a closed business loop from merchant setup to delivery, receivable tracking, payment confirmation, and review."
Add-Body $sel "The existing system has approximately 1915 merchant records, proving real-world usability and practical deployment value."

Add-Heading $sel "4. Core Advantages"
Add-Body $sel "Mobile first experience for field teams."
Add-Body $sel "Fast deployment in local or private environments."
Add-Body $sel "Traceable data through snapshots and records."
Add-Body $sel "Clear APIs for extension to mini programs, BI dashboards, and intelligent forecasting."

Add-Heading $sel "5. Business Model"
Add-Body $sel "Revenue model: software subscription + implementation service + value-added modules."
Add-Body $sel "Basic annual plan for single-team operations."
Add-Body $sel "Professional plan with role permissions and advanced reports."
Add-Body $sel "Enterprise plan with customization and private deployment."

Add-Heading $sel "6. Go-To-Market Strategy"
Add-Body $sel "Start with regional pilot customers and replicate benchmark cases."
Add-Body $sel "Expand through partner channels and industry communities."
Add-Body $sel "Use trial-review-contract conversion path to improve close rate."

Add-Heading $sel "7. Development Roadmap"
Add-Body $sel "0-6 months: polish core workflows and onboard seed customers."
Add-Body $sel "6-18 months: add multi-warehouse collaboration and data insights."
Add-Body $sel "18+ months: evolve into a broader digital platform for FMCG distribution."

Add-Heading $sel "8. Team and Risk Control"
Add-Body $sel "The team combines software development capability and scenario understanding. Iteration follows rapid feedback from frontline users."
Add-Body $sel "Data security relies on private deployment options, routine backup, and access control."

Add-Heading $sel "9. Funding and Resource Needs"
Add-Body $sel "Current needs include pilot clients, mentor support, and market resources. Funds will be used for product refinement, pilot expansion, and channel development."

Add-Heading $sel "10. Conclusion"
Add-Body $sel "The project is practical, scalable, and competition-ready. It aims to become affordable and effective digital infrastructure for distributor operations."

$doc.SaveAs([string]$wordPath, 16)
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null

$pp = New-Object -ComObject PowerPoint.Application
$presentation = $pp.Presentations.Add()

function Add-Slide($presentation, $title, $bullets) {
    $layout = 2
    $slide = $presentation.Slides.Add($presentation.Slides.Count + 1, $layout)
    $slide.Shapes.Title.TextFrame.TextRange.Text = $title
    $slide.Shapes.Item(2).TextFrame.TextRange.Text = ($bullets -join "`r`n")
}

Add-Slide $presentation "Jinjiu Smart Delivery and Reconciliation" @(
    "Innovation and Entrepreneurship Competition Deck",
    "Positioning: digital SaaS for distributor operations",
    "Goal: improve efficiency, cash collection, and control"
)
Add-Slide $presentation "Problem Statement" @(
    "Delivery and payment information is fragmented",
    "Manual statistics are slow and error-prone",
    "Lack of structured operational data"
)
Add-Slide $presentation "Our Solution" @(
    "Mobile-first delivery and reconciliation system",
    "End-to-end workflow from merchants to payments",
    "Private deployment and quick onboarding"
)
Add-Slide $presentation "Product Modules" @(
    "Merchant and area management",
    "Delivery status, receivable and payment tracking",
    "Operational query pages and snapshot support"
)
Add-Slide $presentation "Technology and Moat" @(
    "Frontend: HTML + JavaScript + PWA",
    "Backend: Node.js + Express + lightweight DB",
    "Advantages: fast deployment, easy extension"
)
Add-Slide $presentation "Current Progress" @(
    "Usable system prototype is online",
    "About 1915 merchant records already accumulated",
    "Ready for scaled pilots"
)
Add-Slide $presentation "Business Model" @(
    "Subscription tiers: basic, professional, enterprise",
    "Implementation service and training",
    "Value-added analytics and customization"
)
Add-Slide $presentation "Growth Strategy" @(
    "Pilot-first benchmark customer strategy",
    "Partnership with local industry channels",
    "Trial to contract conversion process"
)
Add-Slide $presentation "Roadmap" @(
    "0-6 months: strengthen core use cases",
    "6-18 months: add collaboration and analytics",
    "18+ months: platformization"
)
Add-Slide $presentation "Ask" @(
    "Need pilot resources, mentors, and channels",
    "Use funds for product, marketing, and operations",
    "Build practical digital infrastructure for distributors"
)

$presentation.SaveAs($pptxPath)
$presentation.SaveAs($pdfPath, 32)
$presentation.Close()
$pp.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($presentation) | Out-Null
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($pp) | Out-Null

Write-Output "Generated:"
Write-Output $wordPath
Write-Output $pptxPath
Write-Output $pdfPath
