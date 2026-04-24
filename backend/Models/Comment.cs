using System.ComponentModel.DataAnnotations;

namespace RR.MRO.Api.Models;

public class Comment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string AuthorRole { get; set; } = string.Empty;

    public bool IsInternal { get; set; }

    public Guid RequestId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
