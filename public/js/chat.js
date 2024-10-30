jQuery(document).ready(function ($) {
    const socket = io('http://localhost:5159');

    socket.on('connect', () => {
        //console.log('Connected to server');
    });
    socket.on('connect_error', (error) => {
        console.error('Connection failed:', error);
    });

    let roomName = $(".select-client").val();
    $(".select-client").change(function () {
        var user_id = $(this).val();
        roomName = user_id;
        window.location.href = "/admin/chat/" + user_id;
    });

    if (roomName) {
        socket.emit('joinRoom', roomName);
    }
	
	if(document.getElementById('myTable')){
        socket.emit('joinRoom', 'adminRoom');
    }
	
	// Listen for admin messages
    socket.on('adminNotification', (msg) => {
        //if(document.getElementById('myTable')){
            var preVal = $(".count"+msg.user_id).text();
            $(".count"+msg.user_id).text(parseInt(preVal) + 1);
            toastr.success('You have received a new message from '+msg.username+'!', 'Hello Admin');
        //}
    });

    // Listen for messages
    socket.on('message', (msg) => {
        // Create a new date
        const date = new Date();
        const formattedDate = formatDate(date);
        if(msg.user_id == 1){
            let adminItem = `<li class="message right">
                <div class="chat-date">${formattedDate}</div>
                <div class="chatblock">
                    <p>${msg.message}</p>
                </div>
            </li>`;
            let userItem = `<li class="message left">
                <div class="chat-date">${formattedDate}</div>
                <div class="chatblock">
                    <p>${msg.message}</p>
                </div>
            </li>`;
            // $(".admin-"+msg.recipient_id+"-chat-messages").append(adminItem);
            // $(".user-"+msg.recipient_id+"-chat-messages").append(userItem);
            $(".admin-chatting").append(adminItem);
            $(".user-chatting").append(userItem);
            // Scroll to the newly added item
            scrollToLatestMessage();
        }

        if(msg.recipient_id == 1){
            let adminItem = `<li class="message left">
                <div class="chat-date">${formattedDate}</div>
                <div class="chatblock">
                    <p>${msg.message}</p>
                </div>
            </li>`;
            let userItem = `<li class="message right">
                <div class="chat-date">${formattedDate}</div>
                <div class="chatblock">
                    <p>${msg.message}</p>
                </div>
            </li>`;
            // $(".admin-"+msg.user_id+"-chat-messages").append(adminItem);
            // $(".user-"+msg.user_id+"-chat-messages").append(userItem);
            $(".admin-chatting").append(adminItem);
            $(".user-chatting").append(userItem);
            // Scroll to the newly added item
            scrollToLatestMessage();
        }
    });
    let typingTimer;
    // Send a message to users
    document.getElementById('admin-chat-form') && document.getElementById('admin-chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('send-message');
        const recipient_id = $(".select-client").val();
        const user_id = 1;
        const message = input.value;
        if (message) {
            const msg = {
                recipient_id,
                user_id,
                message
            };
            //socket.emit('chat message', msg);
            socket.emit('chatMessage', { roomName, msg });
            input.value = '';
        }
    });
    // Send a message to admin
    document.getElementById('user-chat-form') && document.getElementById('user-chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('send-message');
        const recipient_id = 1;
        const user_id = $(".select-client").val();
        const message = input.value;
		const username = document.getElementById('chat-message').getAttribute('data-username');
        if (message) {
            const msg = {
                recipient_id,
                user_id,
                message,
				username
            };
            socket.emit('chatMessage', { roomName, msg });
			socket.emit('adminMessageReceived', { roomName: 'adminRoom', msg });
            input.value = '';
        }
    });

    // Show typing indecator 
    const message_field = document.getElementById('send-message');
    
    message_field.addEventListener('keyup', () => {        
        const recipient_id = 1;        
        const sender_id = $(".select-client").val();        
        socket.emit('typing', { roomName, sender_id, recipient_id });        
        clearTimeout(typingTimer);        
        typingTimer = setTimeout(() => {
            socket.emit('stopTyping', { roomName, sender_id, recipient_id });
        }, 500);
    });
    socket.on('displayTyping', ({ sender_id, recipient_id }) => {
        console.log('displayTyping', sender_id);
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.innerText = `User ${sender_id} is typing...`;
        typingIndicator.style.display = 'block';
    });
    socket.on('hideTyping', ({ sender_id, recipient_id }) => {
        const typingIndicator = document.getElementById('typing-indicator');
        typingIndicator.style.display = 'none';
    });
    // Select the container that holds all the messages
    const messageContainer = document.querySelector('.chat-container ul');

    // Function to scroll to the latest message
    function scrollToLatestMessage() {
        if(document.getElementById('chat-message')){
            const lastMessage = messageContainer.querySelector('li.message:last-child');
            if (lastMessage) {
                lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }
    }

    function formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return date.toLocaleString('en-GB', options).replace(',', '');
    }

    scrollToLatestMessage();

    if(document.getElementById('emojiButton')) {
        const emojiButton = document.getElementById('emojiButton');
        const emojiPicker = document.getElementById('emojiPicker');
        const messageInput = document.getElementById('send-message');    
        // Toggle emoji picker visibility
        emojiButton.addEventListener('click', () => {
            emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
            event.stopPropagation();
        });
        document.addEventListener('click', (event) => {
            if (!emojiPicker.contains(event.target) && event.target !== emojiButton) {
                emojiPicker.style.display = 'none';
            }
        });
        // $(document).on('click', function(event) {
        //     emojiPicker.style.display = 'none';
        // });
        // Insert emoji into input field
        emojiPicker.addEventListener('emoji-click', (event) => {
            messageInput.value += event.detail.unicode;
            // emojiPicker.style.display = 'none'; // Hide picker after selection
        });
    }    
    $('.gif_pop_opener').on('click', function(event) {
        $('.gif_popup').toggle();
        searchGif();
        event.stopPropagation();
    });
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.gif_popup').length) {
            $('.gif_popup').hide();
        }
    });
    
    async function searchGif() {
        const query = document.getElementById('gif_search_keyup').value || 'funny';
        const element = document.getElementById('gif_search_keyup');
        let usertype = element.getAttribute("data-usertype"); 

        
        const response = await fetch(`/search-gif?q=${query}`);
        const gifs = await response.json();

        // Display GIFs in the container
        const gifContainer = document.getElementById('gif-container');
        gifContainer.innerHTML = ''; // Clear previous results

        gifs.forEach(gif => {
            const img = document.createElement('img');
            img.src = gif.media_formats.gif.url;
            img.alt = gif.content_description;
            img.classList.add('gif-image');

            img.onclick = () => selectGif(gif.media_formats.gif.url, socket, roomName, usertype); // Select GIF when clicked

            gifContainer.appendChild(img);
        });
    }
    $('#gif_search_keyup').on('keyup', searchGif);
    
});



function selectGif(url, socket, roomName, usertype) {    

    const input = document.getElementById('send-message');
    let recipient_id = '';
    let user_id = '';
    if(usertype == 'admin') {
        recipient_id = $(".select-client").val();
        user_id = 1;    
    } else {
        recipient_id = 1;
        user_id = $(".select-client").val();
    }
    
    const message = `<img src="`+url+`" />`;
    const username = document.getElementById('chat-message').getAttribute('data-username');
    if (message) {
        const msg = {
            recipient_id,
            user_id,
            message,
            username
        };
        socket.emit('chatMessage', { roomName, msg });
        socket.emit('adminMessageReceived', { roomName: 'adminRoom', msg });
        input.value = '';
        $('.gif_popup').hide();
    }
}
