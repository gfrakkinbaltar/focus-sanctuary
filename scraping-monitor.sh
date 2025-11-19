#!/bin/bash

# Focus Sanctuary - Skill Scraping Monitor & Launcher
# Location: /home/gaius/Skill_Seekers/

SKILLS_DIR="/home/gaius/Skill_Seekers"
OUTPUT_DIR="$SKILLS_DIR/output"
CONFIGS_DIR="$SKILLS_DIR/configs"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Skills to process
declare -a SKILLS=(
    "react-three-fiber:HIGH"
    "threejs:HIGH"
    "framer-motion:HIGH"
    "zustand:HIGH"
    "tonejs:HIGH"
    "vite:MEDIUM"
    "turborepo:MEDIUM"
    "tailwindcss:MEDIUM"
)

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Focus Sanctuary - Skill Seeker Setup & Monitor          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if a skill has been scraped
check_skill_status() {
    local skill_name=$1
    local skill_dir="$OUTPUT_DIR/$skill_name"
    local skill_zip="$OUTPUT_DIR/$skill_name.zip"
    
    if [ -f "$skill_zip" ]; then
        echo -e "${GREEN}✓ PACKAGED${NC}"
    elif [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
        echo -e "${YELLOW}⚡ SCRAPED (needs packaging)${NC}"
    elif [ -d "$skill_dir" ]; then
        echo -e "${YELLOW}⏳ IN PROGRESS${NC}"
    else
        echo -e "${RED}○ NOT STARTED${NC}"
    fi
}

# Display current status
echo -e "${BLUE}Current Status:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
printf "%-25s %-12s %s\n" "SKILL" "PRIORITY" "STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for skill_info in "${SKILLS[@]}"; do
    IFS=':' read -r skill priority <<< "$skill_info"
    status=$(check_skill_status "$skill")
    printf "%-25s %-12s %s\n" "$skill" "$priority" "$status"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Main menu
echo -e "${BLUE}What would you like to do?${NC}"
echo "1) Start all HIGH priority scraping (parallel)"
echo "2) Start ALL scraping (parallel)"
echo "3) Package all scraped skills"
echo "4) Monitor scraping progress"
echo "5) Check detailed status"
echo "6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}Starting HIGH priority skills...${NC}"
        cd "$SKILLS_DIR"
        for skill_info in "${SKILLS[@]}"; do
            IFS=':' read -r skill priority <<< "$skill_info"
            if [ "$priority" = "HIGH" ]; then
                if [ ! -f "$OUTPUT_DIR/$skill.zip" ]; then
                    echo -e "${BLUE}→ Starting $skill...${NC}"
                    python -m cli.main scrape "configs/$skill.json" &
                    sleep 2  # Stagger starts slightly
                fi
            fi
        done
        echo -e "${GREEN}✓ All HIGH priority scraping started in background${NC}"
        echo "Use option 4 to monitor progress"
        ;;
        
    2)
        echo -e "${YELLOW}Starting ALL skills...${NC}"
        cd "$SKILLS_DIR"
        for skill_info in "${SKILLS[@]}"; do
            IFS=':' read -r skill priority <<< "$skill_info"
            if [ ! -f "$OUTPUT_DIR/$skill.zip" ]; then
                echo -e "${BLUE}→ Starting $skill...${NC}"
                python -m cli.main scrape "configs/$skill.json" &
                sleep 2  # Stagger starts slightly
            fi
        done
        echo -e "${GREEN}✓ All scraping started in background${NC}"
        echo "Use option 4 to monitor progress"
        ;;
        
    3)
        echo -e "${YELLOW}Packaging all scraped skills...${NC}"
        cd "$SKILLS_DIR"
        for skill_info in "${SKILLS[@]}"; do
            IFS=':' read -r skill priority <<< "$skill_info"
            if [ -d "$OUTPUT_DIR/$skill" ] && [ -f "$OUTPUT_DIR/$skill/SKILL.md" ]; then
                if [ ! -f "$OUTPUT_DIR/$skill.zip" ]; then
                    echo -e "${BLUE}→ Packaging $skill...${NC}"
                    python -m cli.main package "output/$skill/"
                fi
            fi
        done
        echo -e "${GREEN}✓ Packaging complete${NC}"
        ;;
        
    4)
        echo -e "${YELLOW}Monitoring scraping progress...${NC}"
        echo "Press Ctrl+C to stop monitoring"
        echo ""
        while true; do
            clear
            echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
            echo -e "${BLUE}║  Live Scraping Progress Monitor                          ║${NC}"
            echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
            echo ""
            
            for skill_info in "${SKILLS[@]}"; do
                IFS=':' read -r skill priority <<< "$skill_info"
                skill_dir="$OUTPUT_DIR/$skill"
                
                if [ -d "$skill_dir" ]; then
                    # Count files in _data directory
                    data_dir="$skill_dir/${skill}_data"
                    if [ -d "$data_dir" ]; then
                        file_count=$(find "$data_dir" -type f -name "*.md" 2>/dev/null | wc -l)
                        echo -e "${BLUE}$skill:${NC} $file_count pages scraped"
                    fi
                fi
            done
            
            echo ""
            echo -e "${YELLOW}Refreshing in 10 seconds...${NC}"
            sleep 10
        done
        ;;
        
    5)
        echo -e "${YELLOW}Detailed Status:${NC}"
        echo ""
        for skill_info in "${SKILLS[@]}"; do
            IFS=':' read -r skill priority <<< "$skill_info"
            skill_dir="$OUTPUT_DIR/$skill"
            
            echo -e "${BLUE}━━━ $skill ━━━${NC}"
            
            if [ -f "$OUTPUT_DIR/$skill.zip" ]; then
                size=$(du -h "$OUTPUT_DIR/$skill.zip" | cut -f1)
                echo -e "Status: ${GREEN}✓ PACKAGED${NC} ($size)"
            elif [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
                data_dir="$skill_dir/${skill}_data"
                if [ -d "$data_dir" ]; then
                    file_count=$(find "$data_dir" -type f -name "*.md" 2>/dev/null | wc -l)
                    dir_size=$(du -sh "$skill_dir" 2>/dev/null | cut -f1)
                    echo -e "Status: ${YELLOW}⚡ SCRAPED${NC}"
                    echo "  Pages: $file_count"
                    echo "  Size: $dir_size"
                fi
            elif [ -d "$skill_dir" ]; then
                echo -e "Status: ${YELLOW}⏳ IN PROGRESS${NC}"
            else
                echo -e "Status: ${RED}○ NOT STARTED${NC}"
            fi
            echo ""
        done
        ;;
        
    6)
        echo -e "${GREEN}Goodbye!${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac