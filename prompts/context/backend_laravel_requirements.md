# Backend Requirements - General Laravel Best Practices

## Project Overview
This document outlines comprehensive backend development requirements and best practices for Laravel applications. The guidelines focus on modern PHP development standards, performance optimization, maintainability, and scalability principles that apply to any Laravel project using Laravel 12+ and the modern PHP ecosystem.

## Core Technology Stack Requirements

### Framework & Language
- **Framework**: Laravel 12+ (mandatory - leverage latest features and minimal breaking changes)
- **Language**: PHP 8.2+ (minimum), PHP 8.5+ (recommended)
- **Package Manager**: Composer 2.7+ (use composer commands for dependency management)
- **Database**: 
  - **Primary**: MySQL 8.4+ (LTS) or PostgreSQL 17+ (recommended for production)
  - **Development**: SQLite 3.40+ (acceptable for local development)
  - **Alternative**: MariaDB 11+ (compatible alternative to MySQL)
- **PHP Extensions**: Required extensions include mbstring, openssl, PDO, tokenizer, xml, ctype, json, bcmath, fileinfo

### Coding Standards & PSR Compliance
- **PSR Standards**: 
  - **PSR-4**: Autoloading standard (mandatory for all classes)
  - **PSR-12**: Extended coding style guide (strictly enforced)
  - **PSR-3**: Logger interface compliance
  - **PSR-6**: Caching interface compliance
  - **PSR-11**: Container interface compliance
- **Code Formatting**: PHP CS Fixer with Laravel preset configuration
- **Static Analysis**: PHPStan Level 8+ or Psalm for comprehensive type checking
- **Documentation**: PHPDoc blocks for all public methods and complex logic

### Architecture Patterns & Design Principles
- **SOLID Principles**: Strict adherence to all SOLID principles
  - **Single Responsibility**: Each class should have only one responsibility
  - **Open/Closed**: Open for extension, closed for modification
  - **Liskov Substitution**: Subtypes must be substitutable for base types
  - **Interface Segregation**: Prefer specific interfaces over general ones
  - **Dependency Inversion**: Depend on abstractions, not concretions
- **Design Patterns**: 
  - **Repository Pattern**: For data access abstraction (when needed)
  - **Service Layer Pattern**: For business logic organization
  - **Observer Pattern**: For event-driven functionality
  - **Factory Pattern**: For object creation complexity management
- **Domain Driven Design**: For complex business logic organization

### File Naming Conventions & Directory Structure
- **Models**: PascalCase singular (e.g., `User.php`, `ProductCategory.php`)
- **Controllers**: PascalCase with Controller suffix (e.g., `UserController.php`, `ApiController.php`)
- **Middleware**: PascalCase (e.g., `AuthenticateUser.php`, `ValidateRequest.php`)
- **Jobs**: PascalCase with descriptive action (e.g., `ProcessUserRegistration.php`, `SendEmailNotification.php`)
- **Events**: PascalCase with descriptive name (e.g., `UserRegistered.php`, `OrderCompleted.php`)
- **Listeners**: PascalCase with descriptive action (e.g., `SendWelcomeEmail.php`, `UpdateInventory.php`)
- **Services**: PascalCase with Service suffix (e.g., `UserService.php`, `PaymentService.php`)
- **Requests**: PascalCase with Request suffix (e.g., `StoreUserRequest.php`, `UpdateProductRequest.php`)
- **Resources**: PascalCase with Resource suffix (e.g., `UserResource.php`, `ProductCollection.php`)
- **Policies**: PascalCase with Policy suffix (e.g., `UserPolicy.php`, `PostPolicy.php`)
- **Migrations**: Laravel timestamp format (e.g., `2024_01_01_000000_create_users_table.php`)

## Laravel 12+ Features & Modern Development

### New Laravel 12 Features Implementation
Laravel 12 introduces focused improvements with minimal breaking changes that should be leveraged:

#### New Application Starter Kits
- **React Starter Kit**: Utilizes Inertia 2, TypeScript, shadcn/ui, and Tailwind CSS
- **Vue Starter Kit**: Features Inertia 2, TypeScript, shadcn/ui integration
- **Livewire Starter Kit**: Uses Flux UI component library with Laravel Volt
- **WorkOS AuthKit Integration**: Social authentication, passkeys, and SSO support options
- **Built-in Authentication**: Comprehensive auth system with login, registration, password reset

#### Enhanced Performance & Architecture
- **Optimized Routing**: More efficient routing mechanism with reduced HTTP request overhead
- **Minimal Breaking Changes**: Focus on quality-of-life improvements without breaking existing code
- **Dependency Updates**: Updated upstream dependencies for improved stability and security
- **Maintenance Release Philosophy**: Easier upgrades with minimal application code changes required
### Modern PHP 8.2+ Features Usage

#### Enhanced Type System
- **Union Types**: Use union types for flexible parameter typing
- **Intersection Types**: Use intersection types for complex type constraints  
- **readonly Properties**: Use readonly properties for immutable data
- **Constructor Property Promotion**: Simplify constructor parameter declarations
- **Attributes**: Use PHP attributes for metadata instead of docblock annotations
- **Enums**: Use enums for fixed sets of values instead of constants

#### Performance Features
- **Just-In-Time (JIT) Compilation**: Configure JIT for performance-critical applications
- **Preloading**: Implement opcache preloading for production performance
- **Fiber Support**: Use fibers for asynchronous programming where beneficial

### Component Architecture Requirements

#### Controller Development Standards
- **Single Responsibility**: Controllers should handle HTTP requests only
- **Thin Controllers**: Business logic belongs in services, not controllers
- **Resource Controllers**: Use resource controllers for RESTful operations
- **API Resources**: Use Eloquent API resources for consistent JSON responses
- **Form Request Validation**: Always use form request classes for validation
- **Dependency Injection**: Use constructor injection for dependencies

#### Model Development Standards
- **Eloquent Best Practices**: Leverage Eloquent's full capabilities
- **Mass Assignment Protection**: Always define fillable or guarded properties
- **Relationships**: Define all model relationships properly
- **Scopes**: Use local and global scopes for reusable query logic
- **Accessors/Mutators**: Use for data transformation
- **Casting**: Define attribute casts for type safety
- **Events**: Use model events for business logic triggers

#### Service Layer Implementation
- **Business Logic Separation**: All business logic in dedicated service classes
- **Interface Contracts**: Define interfaces for service layer abstraction
- **Dependency Injection**: Services should use constructor injection
- **Single Responsibility**: Each service should handle one business domain
- **Testability**: Services must be easily testable in isolation

## Modern Development Patterns

### Fat Models, Skinny Controllers Pattern
- **Models**: Contain business logic, relationships, scopes, and data manipulation
- **Controllers**: Handle HTTP requests, delegate to models/services, return responses
- **Services**: Complex business operations that span multiple models
- **Repositories**: Data access abstraction when needed for complex queries

### API Development Best Practices
- **RESTful Design**: Follow REST principles for API endpoints
- **API Resources**: Use Eloquent API Resources for consistent JSON responses  
- **Versioning**: Implement API versioning strategy from the start
- **Rate Limiting**: Apply appropriate rate limiting to all API endpoints
- **Authentication**: Use Laravel Sanctum for SPA/mobile API authentication
- **Documentation**: Generate API documentation with tools like Scribe
- **Error Handling**: Consistent error response format across all endpoints
- **Pagination**: Use Laravel's built-in pagination for list endpoints

### Database & Query Optimization
- **Migration Best Practices**: Use migrations for all database changes
- **Eloquent Optimization**: Avoid N+1 problems with eager loading
- **Query Builder**: Use Query Builder for complex queries when needed
- **Database Indexing**: Proper indexing strategy for performance
- **Raw Queries**: Use raw queries sparingly and only when necessary
- **Connection Pooling**: Configure connection pooling for high-traffic applications
- **Read Replicas**: Implement read replica configuration for scale

### Security Best Practices
- **Input Validation**: Validate all inputs with form request classes
- **SQL Injection Prevention**: Use parameter binding and Eloquent ORM
- **XSS Prevention**: Proper output escaping in Blade templates
- **CSRF Protection**: Ensure CSRF protection on all forms
- **Authentication**: Use Laravel's built-in authentication features
- **Authorization**: Implement proper authorization with policies and gates
- **Encryption**: Use Laravel's encryption for sensitive data
- **HTTPS Only**: Force HTTPS in production environments

## Performance & Optimization

### Caching Strategy Implementation
- **Application Cache**: Use Redis or Memcached for application caching
- **Query Caching**: Implement intelligent query caching where beneficial
- **View Caching**: Use view caching for static or semi-static content
- **Route Caching**: Enable route caching in production
- **Config Caching**: Enable config caching in production
- **OPcache**: Configure OPcache properly for PHP bytecode caching

### Queue & Job Processing
- **Background Jobs**: Use queues for time-consuming operations
- **Job Design**: Jobs should be idempotent and handle failures gracefully
- **Queue Workers**: Proper queue worker configuration and monitoring
- **Failed Jobs**: Implement failed job handling and retry logic
- **Job Batching**: Use job batching for related operations
- **Queue Priorities**: Use queue priorities for different job types

### Database Performance
- **Connection Management**: Proper database connection configuration
- **Query Optimization**: Analyze and optimize slow queries
- **Indexing Strategy**: Implement comprehensive indexing strategy
- **Database Migrations**: Optimize migration rollback capabilities
- **Chunking**: Use chunking for processing large datasets
- **Database Transactions**: Proper transaction usage for data integrity

## Testing Strategy & Requirements

### Testing Pyramid Implementation
- **Unit Tests (70%)**: Test individual classes and methods in isolation
- **Feature Tests (20%)**: Test HTTP endpoints and application features
- **Integration Tests (10%)**: Test component interactions and external services

### Testing Tools & Frameworks
- **PHPUnit**: Primary testing framework with Laravel integration
- **Pest**: Alternative testing framework with elegant syntax
- **Mockery**: Mocking framework for unit tests
- **Laravel Dusk**: Browser testing for complex user interactions
- **HTTP Testing**: Laravel's built-in HTTP testing capabilities
- **Database Testing**: Use in-memory SQLite for fast test execution

### Testing Best Practices
- **Test Database**: Use separate test database with proper seeding
- **Factory Pattern**: Use model factories for test data generation
- **Mocking**: Mock external dependencies and services
- **Test Coverage**: Maintain minimum 80% code coverage
- **Continuous Integration**: Run tests automatically in CI/CD pipeline
- **Test Documentation**: Document complex test scenarios and edge cases

## Code Quality & Standards

### Laravel Conventions Compliance
Follow Laravel naming conventions strictly:

| What | How | Good | Bad |
|------|-----|------|-----|
| Controller | singular | `ArticleController` | `ArticlesController` |
| Route | plural | `articles/1` | `article/1` |
| Route name | snake_case with dot notation | `users.show_active` | `users-show-active` |
| Model | singular | `User` | `Users` |
| hasOne or belongsTo relationship | singular | `articleComment` | `articleComments` |
| All other relationships | plural | `articleComments` | `articleComment` |
| Table | plural | `article_comments` | `ArticleComments` |
| Pivot table | singular model names in alphabetical order | `article_user` | `user_article` |
| Table column | snake_case without model name | `meta_title` | `MetaTitle` |
| Model property | snake_case | `$model->created_at` | `$model->createdAt` |
| Foreign key | singular model name with _id suffix | `article_id` | `ArticleId` |
| Primary key | - | `id` | `custom_id` |
| Migration | - | `2024_01_01_000000_create_articles_table` | `create_articles_table` |
| Method | camelCase | `getAll` | `get_all` |
| Method in resource controller | [table](https://laravel.com/docs/controllers#resource-controllers) | `store` | `saveArticle` |
| Method in test class | camelCase | `testGuestCannotSeeArticle` | `test_guest_cannot_see_article` |
| Variable | camelCase | `$articlesWithAuthor` | `$articles_with_author` |
| Collection | descriptive, plural | `$activeUsers` | `$users` |
| Object | descriptive, singular | `$activeUser` | `$users[0]` |
| Config and language files index | snake_case | `articles_enabled` | `ArticlesEnabled` |
| View | kebab-case | `show-filtered.blade.php` | `showFiltered.blade.php` |
| Config | snake_case | `google_calendar.php` | `googleCalendar.php` |
| Contract (interface) | adjective or noun | `Authenticatable` | `AuthenticationInterface` |
| Trait | adjective | `Notifiable` | `NotificationTrait` |

### Code Quality Tools
- **Laravel Pint**: For consistent code formatting (Laravel's opinionated PHP CS Fixer)
- **PHPStan**: Static analysis for type checking and error detection
- **Larastan**: Laravel-specific PHPStan extension
- **PHP Insights**: Code quality analysis with beautiful reports
- **PHPMD**: PHP Mess Detector for code quality metrics
- **Pre-commit Hooks**: Automated code quality checks before commits

### Error Handling & Logging
- **Exception Handling**: Comprehensive exception handling strategy
- **Custom Exceptions**: Create custom exceptions for business logic errors
- **Logging**: Structured logging with appropriate log levels
- **Error Reporting**: Integration with error tracking services (Sentry, Flare, etc.)
- **Debug Mode**: Never enable debug mode in production
- **Error Pages**: Custom error pages for better user experience

## Security & Production Readiness

### Security Implementation Checklist
- **Input Sanitization**: Sanitize all user inputs properly
- **Output Encoding**: Encode outputs to prevent XSS attacks
- **SQL Injection Prevention**: Use Eloquent ORM and parameter binding
- **CSRF Protection**: Enable CSRF protection on all forms
- **Mass Assignment Protection**: Configure mass assignment protection on models
- **File Upload Security**: Validate and sanitize file uploads
- **Environment Variables**: Secure storage of sensitive configuration
- **API Security**: Implement proper API authentication and rate limiting

### Production Deployment Requirements
- **Environment Configuration**: Separate configurations for different environments
- **Asset Compilation**: Optimize assets for production using Vite
- **Database Optimization**: Production database configuration and optimization
- **Queue Workers**: Proper queue worker setup and monitoring
- **Cron Jobs**: Task scheduling configuration
- **SSL/TLS**: HTTPS enforcement and proper SSL configuration
- **Web Server Configuration**: Nginx/Apache optimization for Laravel
- **Monitoring**: Application performance monitoring and alerting

### Build-First Development Philosophy
Writing code with production considerations from the start ensures deployment readiness:

#### Laravel 12 Application Build Requirements
- **Zero Artisan Errors**: All Artisan commands must execute without errors
- **Configuration Validation**: All configuration files must be valid and complete
- **Environment Variables**: Proper validation of all required environment variables
- **Database Migrations**: All migrations must run successfully in correct order
- **Composer Dependencies**: All dependencies must be properly declared and compatible
- **Starter Kit Integration**: Proper integration with Laravel 12 starter kits when applicable

#### Code Quality Build Gates
- **PHPUnit Tests**: All tests must pass before deployment
- **Static Analysis**: Code must pass PHPStan/Psalm analysis
- **Code Standards**: Code must conform to PSR-12 and Laravel conventions
- **Security Scanning**: No known security vulnerabilities in dependencies
- **Performance Metrics**: Meet established performance benchmarks

#### Production Readiness Validation
- **Caching Configuration**: All caches properly configured for production
- **Queue System**: Queue workers and job processing properly configured
- **Error Handling**: Comprehensive error handling and logging in place
- **Health Checks**: Laravel 12's built-in health check functionality operational
- **Authentication System**: Proper authentication system (built-in or WorkOS AuthKit) configured

## Development Workflow & Tools

### Development Tools & Debugging
- **Laravel Telescope**: Debugging and profiling during development
- **Laravel Tinker**: Interactive PHP shell for testing and debugging
- **Laravel Sail**: Docker-based development environment

### Package Management & Dependencies
- **Composer**: Dependency management with proper version constraints
- **Package Selection**: Prefer Laravel-native and community-approved packages
- **Version Pinning**: Use semantic versioning and appropriate constraints
- **Security Updates**: Regular security updates and vulnerability scanning
- **Package Evaluation**: Evaluate packages for maintenance and community support

### Standard Laravel Tools Preference
Use Laravel's built-in tools and community-accepted packages:

| Task | Standard Tools | 3rd Party Tools |
|------|----------------|-----------------|
| Authorization | Policies | Entrust, Sentinel |
| Compiling assets | Vite | Grunt, Gulp |
| Development Environment | Laravel Sail, Homestead | Docker |
| Deployment | Laravel Forge | Deployer |
| Unit testing | PHPUnit, Mockery | Phpspec, Pest |
| Browser testing | Laravel Dusk | Codeception |
| DB | Eloquent | SQL, Doctrine |
| Templates | Blade | Twig |
| Working with data | Laravel collections | Arrays |
| Form validation | Request classes | 3rd party packages |
| Authentication | Built-in | 3rd party packages |
| API authentication | Laravel Sanctum | 3rd party JWT packages |
| Creating API | Built-in | Dingo API |
| Working with DB structure | Migrations | Direct DB manipulation |
| Localization | Built-in | 3rd party packages |
| Realtime user interfaces | Laravel Echo, Pusher | WebSockets directly |
| Generating testing data | Seeder classes, Model Factories | Manual data creation |
| Task scheduling | Laravel Task Scheduler | Cron scripts |
| DB | MySQL, PostgreSQL, SQLite | MongoDB |

## API Development Standards

### RESTful API Design
- **Resource-Based URLs**: Use resource-based URL structures
- **HTTP Methods**: Proper use of GET, POST, PUT, PATCH, DELETE
- **Status Codes**: Consistent HTTP status code usage
- **Request/Response Format**: Standardized JSON request and response formats
- **Error Responses**: Consistent error response structure
- **Pagination**: Implement cursor or offset-based pagination
- **Filtering & Sorting**: Support for resource filtering and sorting
- **Versioning Strategy**: URL-based or header-based API versioning

### API Security & Performance
- **Authentication**: Laravel Sanctum for SPA/mobile authentication
- **Rate Limiting**: Per-user and per-IP rate limiting
- **Input Validation**: Comprehensive request validation
- **Output Transformation**: Use API resources for consistent responses
- **Caching**: Implement appropriate API response caching
- **CORS Configuration**: Proper CORS setup for browser-based requests
- **Documentation**: Comprehensive API documentation with examples

### GraphQL Integration (Optional)
- **Lighthouse**: Laravel GraphQL implementation
- **Schema Design**: Efficient GraphQL schema design
- **Query Optimization**: N+1 query prevention in GraphQL
- **Authentication**: GraphQL endpoint authentication
- **Rate Limiting**: GraphQL-specific rate limiting strategies

## Monitoring & Maintenance

### Application Monitoring
- **Health Checks**: Implement comprehensive health check endpoints  
- **Performance Monitoring**: Application performance monitoring (APM)
- **Error Tracking**: Integration with error tracking services
- **Log Management**: Centralized logging and log analysis
- **Uptime Monitoring**: Monitor application availability
- **Database Monitoring**: Database performance and query analysis

### Maintenance Procedures
- **Regular Updates**: Keep Laravel and dependencies updated
- **Security Patches**: Apply security patches promptly
- **Database Maintenance**: Regular database optimization and cleanup
- **Cache Management**: Cache invalidation and optimization strategies
- **Backup Verification**: Regular backup testing and verification
- **Performance Audits**: Regular performance analysis and optimization

### Documentation Standards

#### Code Documentation
- **PHPDoc Blocks**: Document all public methods and complex logic
- **README Files**: Comprehensive project setup and documentation
- **API Documentation**: Complete API endpoint documentation
- **Database Schema**: Document database relationships and constraints
- **Deployment Guide**: Step-by-step deployment instructions
- **Configuration Guide**: Environment-specific configuration documentation

#### Architecture Documentation
- **System Architecture**: High-level system design documentation
- **Database Design**: Entity-relationship diagrams and schema documentation
- **Integration Points**: Document all external service integrations
- **Security Measures**: Document security implementations and policies
- **Performance Considerations**: Document performance optimization strategies

## Quality Assurance Checklist

### Pre-Development
- [ ] Project structure follows Laravel 12+ conventions
- [ ] PHP 8.2+ is configured with required extensions
- [ ] Composer dependencies are properly configured
- [ ] Development environment is set up with proper tools
- [ ] Code quality tools are configured (PHPStan, PHP CS Fixer)

### Development Phase
- [ ] All classes follow PSR-12 coding standards
- [ ] Models have proper relationships and mass assignment protection
- [ ] Controllers are thin and delegate business logic appropriately
- [ ] Form request classes are used for all validation
- [ ] Database migrations are properly structured and reversible
- [ ] API endpoints follow RESTful conventions

### Pre-Production
- [ ] All tests pass (unit, feature, integration)
- [ ] Static analysis passes without errors
- [ ] Security vulnerabilities are addressed
- [ ] Performance benchmarks are met
- [ ] Error handling is comprehensive
- [ ] Production configuration is properly set up

### Production Readiness
- [ ] Environment variables are properly configured
- [ ] Caching strategies are implemented
- [ ] Queue workers are configured and monitored
- [ ] Logging and monitoring are set up
- [ ] Backup systems are operational
- [ ] Security measures are in place and tested

## AI Assistant Guidelines

When working with these requirements:

### Code Generation Guidelines
1. Always use Laravel 12+ features and PHP 8.2+ syntax (PHP 8.4+ preferred)
2. Follow PSR-12 coding standards and Laravel naming conventions strictly
3. Implement proper error handling and validation using Form Request classes
4. Use Eloquent ORM over raw SQL queries unless performance specifically requires otherwise
5. Apply appropriate design patterns (Service layer, Repository when needed)
6. Ensure proper type hints and return types for all methods
7. Implement comprehensive security measures and input validation
8. Leverage Laravel 12's new starter kits when building authentication systems
9. Use WorkOS AuthKit integration when advanced authentication features are needed

### Architecture Guidelines
1. Follow SOLID principles in all class designs with single responsibility focus
2. Implement proper dependency injection using Laravel's container
3. Use Laravel's built-in features over third-party solutions when equivalent functionality exists
4. Design for testability and maintainability with clear separation of concerns
5. Consider performance implications and implement appropriate optimization strategies
6. Implement proper caching strategies using Laravel's caching system
7. Follow fat models, skinny controllers pattern consistently
8. Use Laravel 12's optimized routing mechanisms for better performance

### Best Practice Enforcement
1. Business logic belongs in models or service classes, never in controllers
2. Use form request classes for all input validation without exceptions
3. Implement proper authentication using Laravel 12's built-in system or WorkOS AuthKit
4. Use Laravel's authorization system (policies and gates) for access control
5. Follow Laravel naming conventions exactly as specified in documentation
6. Write comprehensive tests for all functionality using PHPUnit or Pest
7. Document complex business logic and architectural decisions clearly
8. Use Laravel 12's starter kits as foundation for frontend integration

### Security & Performance Focus
1. Validate and sanitize all inputs using Laravel's validation system
2. Use proper authentication and authorization mechanisms (Sanctum for APIs)
3. Implement comprehensive error handling with proper logging
4. Optimize database queries using eager loading to prevent N+1 problems
5. Implement appropriate caching strategies (Redis/Memcached for production)
6. Use background jobs for time-consuming operations with proper queue management
7. Follow security best practices including CSRF protection and XSS prevention
8. Leverage Laravel 12's performance optimizations and minimal breaking changes philosophy

This document serves as a comprehensive guide for Laravel development, focusing on modern PHP and Laravel features, best practices, security, performance optimization, and maintainability. The requirements should be adapted based on specific project needs while maintaining the core principles outlined here.