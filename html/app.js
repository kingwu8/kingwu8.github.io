document.addEventListener("DOMContentLoaded", function () {
    fetch('https://api.oioweb.cn/api/common/HotList')
        .then(response => response.json())
        .then(data => {
            displayData(data.result);
        });

    function displayData(result) {
        const content = document.getElementById('content');
        const menu = document.getElementById('menu'); // 获取目录元素
        const toggleMenuButton = document.getElementById('toggle-menu'); // 获取按钮元素
        const toggleLayoutButton = document.getElementById('toggle-layout'); // 获取切换布局按钮元素
        const toggleDarkModeButton = document.getElementById('toggle-dark-mode'); // 获取夜间模式切换按钮元素
        let isSingleColumn = false;
        let isDarkMode = false;

        for (const category in result) {
            const section = document.createElement('div');
            section.classList.add('category-section');
            section.id = `${category.toLowerCase()}-section`;
            
            const title = document.createElement('h2');
            title.innerHTML = `<i class="fas fa-folder-open title-icon"></i>${category}`;
            section.appendChild(title);

            const ul = document.createElement('ul');
            ul.id = `${category.toLowerCase()}-list`;
            section.appendChild(ul);

            const items = result[category].slice(0, 10); // 只取前 10 条内容

            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${item.index}. ${item.title} - ${item.hot}
                    <a href="${item.href}" target="_blank" class="read-more">Read</a>`;
                ul.appendChild(li);
            });

            // 如果内容超过 10 条，则添加一个展开按钮
            if (result[category].length > 10) {
                const expandButton = document.createElement('button');
                expandButton.textContent = '展开更多';
                expandButton.classList.add('expand-button');
                expandButton.addEventListener('click', function() {
                    const currentItemsCount = ul.children.length; // 当前已显示的条目数
                    const nextItems = result[category].slice(currentItemsCount, currentItemsCount + 10); // 取下 10 条内容
                    nextItems.forEach(item => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            ${item.index}. ${item.title} - ${item.hot}
                            <a href="${item.href}" target="_blank" class="read-more">Read</a>`;
                        ul.appendChild(li);
                    });
                    // 如果剩余条目不足 10 条，则隐藏展开按钮
                    if (ul.children.length === result[category].length) {
                        expandButton.style.display = 'none';
                    }
                });
                section.appendChild(expandButton);
            }

            content.appendChild(section);

            // 创建目录项并添加点击事件监听
            const menuItem = document.createElement('div');
            menuItem.innerHTML = `<i class="fas fa-folder-open"></i> ${category}`;
            // menuItem.textContent = category;
            menuItem.classList.add('menu-item');
            menuItem.addEventListener('click', function() {
                const targetSection = document.getElementById(`${category.toLowerCase()}-section`);
                targetSection.scrollIntoView({ behavior: 'smooth' });
                menu.classList.add('hidden'); // 点击目录项后隐藏目录
            });
            menu.appendChild(menuItem);
        }

        // 添加按钮点击事件监听
        toggleMenuButton.addEventListener('click', function() {
            menu.classList.toggle('hidden'); // 切换隐藏/显示状态
            toggleMenuButton.innerHTML = menu.classList.contains('hidden') ? '<i class="fas fa-bars icon"></i>' : '<i class="fas fa-times icon"></i>';
        });

        // 添加切换布局按钮点击事件监听
        toggleLayoutButton.addEventListener('click', function() {
            isSingleColumn = !isSingleColumn;
            adjustLayout();
        });

        // 添加夜间模式切换按钮点击事件监听
        toggleDarkModeButton.addEventListener('click', function() {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                toggleDarkModeButton.innerHTML = '<i class="fas fa-sun icon"></i>';
            } else {
                document.body.classList.remove('dark-mode');
                toggleDarkModeButton.innerHTML = '<i class="fas fa-moon icon"></i>';
            }
        });

        // 自适应布局函数
        function adjustLayout() {
            if (isSingleColumn) {
                content.style.flexDirection = 'column';
                content.style.alignItems = 'center';
                const sections = content.querySelectorAll('.category-section');
                sections.forEach(section => {
                    section.style.width = '80%';
                });
                toggleLayoutButton.innerHTML = '<i class="fas fa-columns icon"></i>';
            } else {
                content.style.flexDirection = 'row';
                content.style.alignItems = 'stretch';
                const sections = content.querySelectorAll('.category-section');
                sections.forEach(section => {
                    section.style.width = '300px';
                });
                toggleLayoutButton.innerHTML = '<i class="fas fa-stream icon"></i>';
            }
        }

        window.addEventListener('resize', adjustLayout);
        adjustLayout(); // 初始调用以设置布局
    }
});
