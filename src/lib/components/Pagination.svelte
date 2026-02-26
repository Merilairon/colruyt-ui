<script lang="ts">
    import { Pagination, PaginationItem } from 'flowbite-svelte';

    let { pages, onPageChange } = $props();

    const onPrevious = () => {
        if (pages.currentPage > 1) {
            onPageChange(pages.currentPage - 1);
        }
    };

    const onNext = () => {
        if (pages.currentPage < pages.totalPages) {
            onPageChange(pages.currentPage + 1);
        }
    };

    const onFirst = () => {
        if (pages.currentPage > 1) {
            onPageChange(1);
        }
    };

    const onLast = () => {
        if (pages.currentPage < pages.totalPages) {
            onPageChange(pages.totalPages);
        }
    };
</script>

{#if pages.totalPages > 1}
    <Pagination 
        first={onFirst} 
        last={onLast}
        next={onNext} 
        previous={onPrevious}
        pages={pages.pages}
        bind:active={pages.currentPage}
        class="mx-auto mt-4 w-fit"
    >
        <svelte:fragment slot="start"> 
            <PaginationItem class="p-2.5">
                Page {pages.currentPage} of {pages.totalPages}
            </PaginationItem>
        </svelte:fragment>
    </Pagination>
{/if}
