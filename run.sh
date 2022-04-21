tmux new -s project -d
tmux send-keys -t project 'cd restify' C-m
tmux send-keys -t project 'echo "Entering virtual env"' C-m
tmux send-keys -t project 'source venv/bin/activate' C-m
tmux send-keys -t project 'echo "running server"' C-m
tmux send-keys -t project 'python3 manage.py runserver' C-m
tmux split-window -v -t project
tmux send-keys -t project 'cd restify-front' C-m
tmux send-keys -t project 'npm start' C-m
tmux attach -t project

