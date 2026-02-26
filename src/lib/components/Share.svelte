<script lang="ts">
    import { Button } from "flowbite-svelte";
    import { ShareOutline } from "flowbite-svelte-icons";

    let { url, title } = $props();

    function share() {
        if (navigator.share) {
            navigator.share({
                title,
                url
            });
        }
    }
</script>

<Button on:click={share}>
    <ShareOutline class="w-6 h-6" />
</Button>
