# Install jq if not installed
if ! command -v jq &> /dev/null; then
  echo "jq is not installed. Installing jq..."
  sudo apt-get update
  sudo apt-get install -y jq
fi

# Set the time interval (in seconds) between each filter operation
interval=1

filter_logs() {
  tmp_file=$(mktemp)
  jq -n --slurpfile input pong.log.json 'reduce $input[] as $item ({"prev_msg": "", "logs": []}; if .prev_msg == $item.message then . else .prev_msg = $item.message | .logs += [$item] end) | .logs' > "$tmp_file"
  mv "$tmp_file" reduced.json
}

iteration=0

while true; do
  if [ $((iteration % 1000)) -eq 0 ]; then
	echo "" > pong.log.json;
  fi
  iteration=${iteration}+1
  filter_logs
#   echo "Filtered log file in place at $(date)"
  sleep $interval
done


